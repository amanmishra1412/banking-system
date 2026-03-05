const { Router } = require("express");
const { registerController } = require("../controllers/auth.controller");

const router = Router()

router.post('register', registerController)

module.exports = router;