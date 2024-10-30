const { validationResult } = require('express-validator');
const RequsetValidationError = require('../errors/request-validation-error');

module.exports = (req, res, next) => {
    // validation 
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        // console.log(errors.array())
        // const error = new Error(errors.array()[0].msg) //first element of error array and select msg
        // error.status = 400;
        // return next(error);
        return next(new RequsetValidationError(errors.array()))
    }

    next();
} 