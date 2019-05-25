const express = require('express')
const _ = require('lodash')
const router = express.Router()
const {User} = require('../models/User')
const { authenticateUser } = require('../middlewares/authentication')
const { authorizeUser } = require('../middlewares/authorization')

router.post('/register',function(req,res){
    const body = _.pick(req.body,['username','email','password','addresses'])
    const user = new User(body)
    user.save()
        .then(function(user){
             res.send(user)
        })
        .catch(function(err){
             res.send(err)
        })
      
})

router.post('/login', function (req, res) {
    const body = req.body
    User.findByCredentials(body.usernameOrEmail, body.password)
        .then(function (user) {
            return user.generateToken()
        })
        .then(function (token) {
            res.setHeader('x-auth', token).send({})
        })
        .catch(function (err) {
            res.send(err)
        })

})


router.get('/',authenticateUser,function(req,res){
    User.findById(req.user._id)  
         .then(function(user){
             res.send(user)
         })
         .catch(function(err){
             res.send(err)
         })
 })

 router.post('/addresses',authenticateUser,function(req,res){
    const body = _.pick(req.body,['addresses'])
    req.user.addresses.push(body.addresses)
    User.findByIdAndUpdate(req.user._id,{addresses:req.user.addresses},{new:true})
        .then(function(user){
            res.send({
                user,'notice':'Address added successfully'
            })
        })
        .catch(function(err){
            res.send(err)
        })
})

router.put('/addresses/:id',authenticateUser,function(req,res){
    const body = _.pick(req.body,['addresses'])
    req.users.addresses.forEach(function(address){
        if(address._id == req.params.id){
            findByIdAndUpdate(req.params.id,{addresses:body},{new:true})
        }
    })

})

module.exports = {
    usersRouter : router
}