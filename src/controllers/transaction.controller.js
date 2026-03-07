const mongoose = require("mongoose");
const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");

const createTransaction = async (req, res) => {
    try {
        const { fromAcc, toAcc, amount, idempotencyKey } = req.body

        if (!fromAcc || !toAcc || !amount || !idempotencyKey) {
            return res.status(400).json({
                message: "FromAccount, toAccount, amount and idempotencyKey are required"
            })
        }

        const fromUserAccount = await accountModel.findOne({
            _id: fromAcc,
        })

        const toUserAccount = await accountModel.findOne({
            _id: toAcc,
        })

        if (!fromUserAccount || !toUserAccount) {
            return res.status(400).json({
                message: "Invalid fromAccount or toAccount"
            })
        }

        const transactionAlready = await transactionModel.findOne({
            idempotencyKey: idempotencyKey
        })

        if (transactionAlready) {
            if (transactionAlready.status === "COMPLETED") {
                return res.status(200).json({
                    message: "Transaction already processed",
                    transaction: transactionAlready
                })

            }

            if (transactionAlready.status === "PENDING") {
                return res.status(200).json({
                    message: "Transaction is still processing",
                })
            }

            if (transactionAlready.status === "FAILED") {
                return res.status(500).json({
                    message: "Transaction processing failed, please retry"
                })
            }

            if (transactionAlready.status === "REVERSED") {
                return res.status(500).json({
                    message: "Transaction was reversed, please retry"
                })
            }
        }

        if (fromUserAccount.status !== "active" || toUserAccount.status !== "active") {
            return res.status(400).json({
                message: "Both fromAccount and toAccount must be active to process transaction"
            })
        }

        const balance = await fromUserAccount.getBalance()

        if (balance < amount) {
            return res.status(400).json({
                message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
            })
        }

        let transaction;
        try {

            const session = await mongoose.startSession()
            session.startTransaction()

            transaction = (await transactionModel.create([{
                fromAccount,
                toAccount,
                amount,
                idempotencyKey,
                status: "PENDING"
            }], { session }))[0]

            const debitLedgerEntry = await ledgerModel.create([{
                account: fromAccount,
                amount: amount,
                transaction: transaction._id,
                type: "DEBIT"
            }], { session })

            await (() => {
                return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
            })()

            const creditLedgerEntry = await ledgerModel.create([{
                account: toAccount,
                amount: amount,
                transaction: transaction._id,
                type: "CREDIT"
            }], { session })

            await transactionModel.findOneAndUpdate(
                { _id: transaction._id },
                { status: "COMPLETED" },
                { session }
            )


            await session.commitTransaction()
            session.endSession()
        } catch (error) {

            return res.status(400).json({
                message: "Transaction is Pending due to some issue, please retry after sometime",
            })

        }

    } catch (err) {

    }
}

const createInitialFundsTransaction = async (req, res) => {
    const { toAcc, amount, idempotencyKey } = req.bodys

    if (!toAcc || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAcc, amount and idempotencyKey are required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAcc,
    })

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid toAcc"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    })

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System user account not found"
        })
    }


    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAcc,
        amount,
        idempotencyKey,
        status: "PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session })

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAcc,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message: "Initial funds transaction completed successfully",
        transaction: transaction
    })
}

module.exports = { createTransaction, createInitialFundsTransaction }