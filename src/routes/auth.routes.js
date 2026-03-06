const { Router } = require("express");
const { registerController, loginController } = require("../controllers/auth.controller");

const router = Router()

router.post('/register', registerController)
router.post('/login', loginController)

module.exports = router;