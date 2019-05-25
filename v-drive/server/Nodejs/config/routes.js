const express = require ('express')
const router = express.Router()

const { usersRouter } = require('../app/controllers/UsersController')
const {adminRouter} = require('../app/controllers/AdminController')

router.use('/users', usersRouter)
router.use('/admin',adminRouter)

module.exports = {
    routes: router 
}