const express = require('express')
const { check } = require('express-validator')
const validationRequest = require('../../common/middleware/validation-request')
const Ebook = require('../../models/ebook')
const BadRequestError = require('../../common/errors/bad-request-error')
const uploadPdf = require('../../common/middleware/upload-pdf')
const User = require('../../models/user')

const router = express.Router()

router.post('/create', uploadPdf, check(['title', 'price'], 'title and price are required!').notEmpty(), validationRequest, async (req, res, next) => {
    const { title, description, price } = req.body

    try {
        if (!req.file) throw new BadRequestError('a PDF file is required')

        const { filename } = req.file

        const ebook = new Ebook({
            title,
            description,
            price,
            filename,
            user: req.currentUser.userId
        })

        await ebook.save()

        await User.findOneAndUpdate({_id: req.currentUser.userId},
            { $push: { ebooks: ebook._id } })

        res.status(200).json({ ebook })
        
    } catch (error) {
        next(error)
    }

})

module.exports = router;