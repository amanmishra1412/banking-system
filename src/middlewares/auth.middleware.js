const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const userLogin = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ msg: "Token Not Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id)

        req.user = user

        return next()

    } catch (err) {
        return res.status(401).json({ msg: "Token Invalid", err: err.message });
    }
};

module.exports = userLogin