const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connect");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDb;
