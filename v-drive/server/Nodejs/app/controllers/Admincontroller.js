const { authenticateUser } = require('../middlewares/authentication')
const { authorizeUser } = require('../middlewares/authorization')

router.get('/users',authenticateUser,authorizeUser,function(req,res){
    User.find()
        .then(function(users){
            res.send(users)
        })
        .catch(function(err){
            res.send(err)
        })
})

router.post('/users',authenticateUser,authorizeUser,function(req,res){
    const body = _.pick(req.body,['username','password','email','roles','addresses '])
    const user = new User(body)
    user.save()
        .then(function(user){
            res.send({
                user,
                notice: 'registration successful'
            })
        })
        .catch(function(err){
            res.send(err)
        })
})

router.put('/users/:id',authenticateUser,authorizeUser,function(req,res){
    const {id} = req.params
    const body = _.pick(req.body,['username','allowAccess'])
    User.findByRoleAndUpdate(req.user,id, body)
        .then(function(user){   
            res.send({
                user,
                notice:'User record updated succesfully'
            })
        })
        .catch(function(err){
            res.send(err)
        })
})

router.delete('/users/:id',authenticateUser,authorizeUser,function(req,res){
    const {id} = req.params
    User.findByRoleAndDelete(req.user,id)
        .then(function(user){   
            res.send({
                user,
                notice:'User deleted succesfully'
            })
        })
        .catch(function(err){
            res.send(err)
        })
})

module.exports = {
    adminRouter: router
}