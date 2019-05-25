const authorizeUser = (req, res, next) => {
    if(req.user.roles.includes('admin')|| req.user.roles.includes('moderator') ) {
        // || req.user.roles.includes('owner')
    //   {
        next()
    }
     else {
        res.status('403').send({
            notice: 'The page does not exist'
        })
    }
}

module.exports = {
    authorizeUser
}