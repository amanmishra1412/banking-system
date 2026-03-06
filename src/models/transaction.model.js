const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        fromAcc: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "account",
            required: [true, "Account required"],
            index: true,
        },
        toAcc: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "account",
            required: [true, "Account required"],
            index: true,
        },
        status: {
            type: String,
            enum: ["pending", "failed", "complete", "reversed"],
            default: "pending",
        },
        amount: {
            type: Number,
            required: [true, "Amount Is required"],
            min: [0, "amount not in negative"],
        },
        idempotencyKey: {
            type: String,
            required: [true, "Key is required"],
            index: true,
            unique: true,
        },
    },
    { 
        timestamps: true 
    },
);

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;