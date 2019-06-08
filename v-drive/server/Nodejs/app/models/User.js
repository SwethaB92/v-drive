const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcrypt')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema

const userSchema = new Schema({

username:{
    type : String,
    required : true,
    unique : true
},
email:{
    type : String,
    required : true,
    unique : true,
    validate: {
        validator: function (value) {
            return validator.isEmail(value)
        },
        message: function () {
            return 'Invalid email format'
        }
    }

},
password:{
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128
},
gender: {
    type: String,
    enum: ["male", "female"]
},
roles: {
    type: String,
    enum:["owner","admin","moderator"],
    default: 'owner' 
},
verified:{
    type: Boolean,
    enum: ["true", "false"]
},
tokens: [
    {
        token: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
],
allowAccess:{
    type : Boolean,
    default : true
}
})

userSchema.statics.findByCredentials = function(email, password){
    const User = this
    console.log('Email', User.findOne({ email }) ) 
    return User.findOne({ email })
                .then(function(user){
                    console.log('user', user)
                    if(!user) {
                        console.log('invalid User')
                        return Promise.reject('invalid email / password')
                    }

                    return bcryptjs.compare(password, user.password)
                                .then(function(result){
                                    if(result) {
                                        return Promise.resolve(user)
                                        // return new Promise(function(resolve, reject){
                                        //     resolve(user)
                                        // })
                                    } else {
                                        return Promise.reject({errors: 'invalid email / password '})
                                    }
                                })
                })
                .catch(function(err){
                    return Promise.reject(err)
                    // return new Promise(function(resolve, reject){
                    //  reject(err) 
                    // })
                })
}

userSchema.statics.findByToken = function (token) {
    const User = this
    let tokenData
    try {
        tokenData = jwt.verify(token, 'jwt@123')
    } catch (err) {
        return Promise.reject(err)
    }

    return User.findOne({
        _id: tokenData._id,
        'tokens.token': token
    })
}

// Defining the instance methods - To generate token

userSchema.methods.generateToken = function () {
    const user = this
    const tokenData = {
        _id: user._id,
        username: user.username,
        createdAt: Number(new Date())
    }

    const token = jwt.sign(tokenData, 'jwt@123')
    user.tokens.push({
        token
    })

    return user.save()
        .then(function (user) {
            return Promise.resolve(token)
        })
        .catch(function (err) {
            return Promise.reject(err)
        })
}

// to update the user id
userSchema.statics.findByRoleAndUpdate = function(user,id,body){

    if(user.roles.includes('admin') ){
       return User.findByIdAndUpdate(id, body,{new: true} )
       .then(function(user){   
           return Promise.resolve(user)
       })
       .catch(function(err){
           return Promise.reject(err)
       })
    }
    else {
        return Promise.reject({
            notice: 'The page does not exist'
        })
    }
}

// To delete the user id
userSchema.statics.findByRoleAndDelete = function(user,id){

    if(user.roles.includes('admin') ){
       return User.findByIdAndDelete(id)
         .then(function(user){   
            return Promise.resolve(user)
       })
          .catch(function(err){
            return Promise.reject(err)
       })
    }
    else {
        return Promise.reject({
            notice: 'The page does not exist'
        })
    }
}

userSchema.pre('save',function(next){
    const user = this
    if(user.isNew){
        function encryptPassword() {
            return bcryptjs.genSalt(10)
                .then(function (salt) {
                    return bcryptjs.hash(user.password, salt)
                        .then(function (encryptedPassword) {
                            user.password = encryptedPassword
                        })
                })
            }
    
            function setRole() {
                return User.countDocuments()
                    .then(function(count){
                        if(count==0){
                            user.roles = ['admin','owner','moderator']
                        }
                    })
                }
                
            return Promise.all([encryptPassword(), setRole()])
                .then(function(values){
                     next()
                })
                .catch(function(err){
                    return Promise.reject(err.message)
                })
    }
    else {
        next()
    }

})

//userSchema.post('save',function(){
//   const user = this
//})

const User = mongoose.model('User', userSchema)

module.exports = {
       User
   }