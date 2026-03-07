const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Account required"],
        index: true,
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: [true, "Transaction required"],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: [true, "Amount Is required"],
        immutable: true
    },
    type: {
        type: String,
        enum: ['CREDIT', 'DEBIT'],
        immutable: true
    }
})

function preventLedgerModification() {
    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);
ledgerSchema.pre('updateMany', preventLedgerModification);
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findOneAndReplace", preventLedgerModification);

const ledgerModel = mongoose.model("ledger", ledgerSchema)
module.exports = ledgerModel