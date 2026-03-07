const { Router } = require("express")
const { userLoginCheck, authSystemUserMiddleware } = require("../middlewares/auth.middleware")
const { createTransaction, createInitialFundsTransaction, createInitialFundsTransaction } = require("../controllers/transaction.controller")

const router = Router()

router.post("/", userLoginCheck, createTransaction)
router.post("/system/initial-funds", authSystemUserMiddleware, createInitialFundsTransaction)


module.exports = router