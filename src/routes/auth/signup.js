const express = require('express')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')

const User = require('../../models/user');
const RequsetValidationError = require('../../common/errors/request-validation-error');
const BadRequestError = require('../../common/errors/bad-request-error');
const validationRequest = require('../../common/middleware/validation-request');

const router = express.Router();

const validators = [
    check('email')
        .not()
        .isEmpty()
        .withMessage('email is required!!!')
        .isEmail()
        .withMessage('Invalid email!')
        .custom(async (value, {req}) => {
           const user = await User.findOne({ email: value})
           if(user) throw new Error('a user with same email already exists.')

           return true;
        }),
    check('password')
        .not()
        .isEmpty()
        .withMessage('password is required!!!')
        .isLength({min: 6, max:15})
        .withMessage('password must be between 6 and 15 characters.')
        .isAlphanumeric()
        .withMessage('passwrod should contains both letters and numbers'),
    check('userName')
        .not()
        .isEmpty()
        .withMessage('username is required!!!')
        .not()
        .isUppercase()
        .withMessage('username can not contains only capital letters')
]

router.post('/signup', validators, validationRequest, async (req, res, next) => {

    // // validation 
    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     // console.log(errors.array())
    //     // const error = new Error(errors.array()[0].msg) //first element of error array and select msg
    //     // error.status = 400;
    //     // return next(error);
    //     return next(new RequsetValidationError(errors.array()))
    // }

    const { userName, email, password } = req.body;

    // with validators
    // if(!userName || !email || !password){
    //     // const error = new Error('all fields are required!')
    //     // error.status = 400
    //     // return next(error)
    //     return next(new BadRequestError('all fields are required!'))
    // }

    try {
        const user = new User({
            userName, email, password
        })

        await user.save()

        const token = jwt.sign({ email, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10h' })

        req.session = { token }
        return res.status(200).json({ user })
    } catch (error) {
        next(error)
    }

})


module.exports = router;