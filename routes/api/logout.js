const express = require('express')
const router = express.Router()
const { handleLogout } = require('../../controllers/logoutControllers')

router.get('/', handleLogout)

module.exports = router