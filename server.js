const mongoose = require("mongoose");
const app = require("./app");
const {MONGODB_URI} = require("./utils/config");

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log("Connected to MongoDB");

    // start the application server
    app.listen(3001, () => {
        console.log("Server is running on port 3001");
    })
})
.catch(error => {
    console.log(`Error connecting to MongoDB : ${error}`);
})
