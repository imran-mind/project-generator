const express = require('express');
const app = express();
const fs = require('fs').promises;
const fsa = require('fs');
const PORT = process.env.PORT || 8080;
var zipper = require('zip-local');
var zip = require('express-easy-zip');

app.use(express.json());
app.use(zip());

app.get('/', (req, res) => {
    res.status(200).json('Server is running')
})

app.get('/run', async (req, res) => {
    const projectName = req.query?.projectName;
    const projectDesc = req.query?.projectDesc;
    const resourceName = req.query?.resourceName;
    const payloadTemplate = req.query?.payload;

    const packageJsonTemplate = {
        "name": projectName,
        "version": "1.0.0",
        "description": projectDesc,
        "main": "index.js",
        "scripts": {
            "start": "nodemon index.js"
        },
        "author": "",
        "license": "ISC",
        "dependencies": {
            "express": "4.18.2",
            "nodemon": "3.0.2"
        }
    }

    const projectPath = `${__dirname}/${projectName}`;
    if (!fsa.existsSync(projectPath)) {
        try {
            await fs.mkdir(projectPath);
            let indexFile =
                await fs.readFile(`${__dirname}/templates/express-index-temp.js`, 'utf-8');
            console.log('--indexFile--', indexFile);
            indexFile = indexFile.replaceAll('$ResourceName', resourceName);

            await fs.writeFile(`${projectPath}/index.js`, indexFile);

            await fs.mkdir(`${projectPath}/controller`);
            await fs.mkdir(`${projectPath}/routes`);
            await fs.mkdir(`${projectPath}/utils`);

            let routesData =
                await fs.readFile(`${__dirname}/templates/express-routes-temp.js`, 'utf-8');
            routesData = routesData.replaceAll('$ResourceName', resourceName);

            await fs.writeFile(`${projectPath}/routes/${resourceName}-routes.js`,
                routesData
            );

            let controllerData =
                await fs.readFile(`${__dirname}/templates/express-controller-temp.js`, 'utf-8');
            controllerData = controllerData.replaceAll('$ResourceName', resourceName);

            await fs.writeFile(`${projectPath}/controller/${resourceName}-controller.js`,
                controllerData
            );

            const zipProject = zipper.sync.zip(projectPath).compress().save(`${projectName}.zip`);
            console.log(zipProject);

            await fs.writeFile(`${projectPath}/package.json`,
                JSON.stringify(packageJsonTemplate, null, 2));


            console.log('sending file')
            await res.zip({
                files: [{
                    path: projectPath,
                    name: projectName
                }],
                filename: `${projectName}.zip`
            });
            // After sending, delete the zip file
            fsa.unlinkSync(`${projectName}.zip`);
            fsa.rmdirSync(`${__dirname}/${projectName}`, { recursive: true, force: true })
            console.log('File deleted successfully!');

        } catch (err) {
            console.log('Error --> ', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        console.log('Else block Error --> ', err);
        res.status(500).json({ message: 'Internal server error' });
    }
})
app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT}`);
})