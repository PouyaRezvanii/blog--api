const express = require('express')
const User = require('../../models/user')

const router = express.Router();

router.get('/current-user', async (req, res, next) => {

    try {
        const user = await User.findById(req.currentUser.userId).select('-password')

        res.status(200).json({ user })

    } catch (error) {
        next(error)
    }

})

module.exports = router;