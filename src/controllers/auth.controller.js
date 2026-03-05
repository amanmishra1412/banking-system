const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const registerController = async (req, res) => {
    const { email, name, password } = req.body;

    const isExist = await userModel.findOne({ email });

    if (isExist) {
        return res
            .status(422)
            .json({ status: false, msg: "User already exist" });
    }

    const user = await userModel.create({ name, email, password });

    const token = jwt.sign(
        {
            id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
    );

    res.cookie("token", token);
    res.status(201).json({ status: true, msg: "User Create Success", user });
};

module.exports = { registerController };