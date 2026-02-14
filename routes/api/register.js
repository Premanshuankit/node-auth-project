const express = require('express')
const router = express.Router()
const {handleNewUser} = require('../../controllers/registerControllers')

router.post('/', handleNewUser)

module.exports = router