const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/not-authorized-error');

const currentUser = (req, res, next) =>{
    try {
        //const token = req.get('Authorization').split(" ")[1]; //using with out cookie-session
        const token = req.session?.token // reading jwt token using cookie session
        //console.log(token)
        if(!token) throw new NotAuthorizedError();
    
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        if(!payload) throw new NotAuthorizedError();

        req.currentUser = payload
        return next()

    } catch (err) {
        return next(err)
    }
}

module.exports = currentUser;