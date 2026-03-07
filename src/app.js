const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");
const transactionRouter = require("./routes/transaction.routes");

const app = express();

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter)
app.use("/api/transaction", transactionRouter)

module.exports = app;