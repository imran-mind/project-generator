
module.exports = {

    get$ResourceName: (req, res) => {
        console.log('Product Created');
        const data = [
            {
                "id": 1,
                "name": "Product 1",
                "price": 19.99,
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            },
            {
                "id": 2,
                "name": "Product 2",
                "price": 29.99,
                "description": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            },
            {
                "id": 3,
                "name": "Product 3",
                "price": 39.99,
                "description": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
            },
            {
                "id": 4,
                "name": "Product 4",
                "price": 49.99,
                "description": "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore."
            }
        ]
        res.status(200)
            .json({ data })
    }
}