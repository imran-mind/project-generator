const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const $ResourceNameRoutes = require('./routes/$ResourceName-routes');

app.use(express.json());

app.get('/ping', (req, res) => {
    res.status(200).json('Server is running')
});

app.use('/api/v1/$ResourceName', $ResourceNameRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});