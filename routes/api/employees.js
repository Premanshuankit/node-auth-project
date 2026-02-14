const express = require('express')
const router = express.Router()
const path = require('path')
const {getAllEmployees, createNewEmployee, updateEmployee, deleteEmployee, getEmployee} = require('../../controllers/employeesControllers')


router.route('/')
    .get(getAllEmployees)
    .post(createNewEmployee)
    .put(updateEmployee)
    .delete(deleteEmployee)

router.route('/:id')
    .get(getEmployee)

module.exports = router