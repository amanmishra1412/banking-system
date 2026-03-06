const { Router } = require("express");
const userLoginCheck = require("../middlewares/auth.middleware");
const { createController } = require("../controllers/account.controller");
const router = Router()

router.post('/', userLoginCheck, createController)

module.exports = router