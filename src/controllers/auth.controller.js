const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const registerController = async (req, res) => {
    try {
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
        
        res.status(201).json({
            status: true, msg: "User Create Success", user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: "Internal Server Error",
            err: error.message
        });
    }
};

const loginController = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        const user = await userModel.findOne({
            $or: [
                { email },
                { name }
            ]
        }).select('+password');

        if (!user) {
            return res.status(401).json({ status: false, msg: "Invalid Credientials" })
        }

        const isPassword = await user.comparePassword(password)

        if (!isPassword) {
            return res.status(401).json({ status: false, msg: "Invalid Credientials" })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );

        res.cookie("token", token);
        res.status(200).json({
            status: true, msg: "Login Success", user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            msg: "Internal Server Error",
            err: err.message
        });
    }

}

module.exports = { registerController, loginController };