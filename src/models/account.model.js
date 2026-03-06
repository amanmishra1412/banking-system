const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "User is required"],
            index: true
        },
        status: {
            enum: {
                value: ["active", "frozen", "closed"],
            },
        },
        currency: {
            type: String,
            required: [true, "currency is required"],
            default: "INR",
        },
    },
    {
        timestamps: true,
    },
);

accountSchema.index({ user: 1, status: 1 })

const accountModel = mongoose.model('account', accountSchema)

module.exports = accountModel