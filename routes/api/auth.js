const express = require('express')
const router = express.Router()
const { handleLogin } = require('../../controllers/authControllers')

router.post('/', handleLogin)

module.exports = router