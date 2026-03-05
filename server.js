require("dotenv").config();
const app = require("./src/app");
const connectDb = require("./src/config/db");

connectDb();

app.listen(3000, () => {
    console.log("Server run");
});