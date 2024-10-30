const express = require('express')
const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const User = require('../../models/user')
const BadRequestError = require('../../common/errors/bad-request-error')

const router = express.Router()

router.post('/signin', async (req, res, next) => {
    const { email, password } = req.body

    if(!email || !password){
        // const error = new Error('all fields are required!')
        // error.status = 400
        // return next(error)
        return next(new BadRequestError('all fields are required!'))
    }

    try {
        const user = await User.findOne({email})
        if(!user){
            // const error = new Error('wrong credentials')
            // error.status = 401
            // return next(error)
            return next(new BadRequestError('wrong credentials'))
        }

        const pwdEqual = await bcrypt.compare(password, user.password)
        if(!pwdEqual){
            // const error = new Error('wrong credentials')
            // error.status = 401
            // return next(error)
            return next(new BadRequestError('wrong credentials'))
        }

        const token = jwt.sign({ email, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10h' })

        req.session = { token }
        return res.status(200).json({ success: true })

    } catch (error) {
        next(error)
    }
})

module.exports = router