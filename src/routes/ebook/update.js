const express = require('express')
const { check } = require('express-validator')
const validationRequest = require('../../common/middleware/validation-request')
const uploadPdf = require('../../common/middleware/upload-pdf')
const Ebook = require('../../models/ebook')
const BadRequestError = require('../../common/errors/bad-request-error')
const fs = require('fs')

const router = express.Router()

router.post('/update/:ebookId', uploadPdf, check(['title', 'price'], 'title and price are required!').notEmpty(), validationRequest, async (req, res, next) => {
    const { title, description, price } = req.body

    try {
        const ebook = await Ebook.findById(req.params.ebookId)
        if(!ebook) throw new BadRequestError('document not found')

        let filename = ebook.filename

        if(req.file){
            fs.unlink('private/ebooks/'+filename, (err) => {
                if(err) throw err
            })
            filename = req.file.filename
        }

        const newEbook = await Ebook.findOneAndUpdate({_id: req.params.ebookId},
            {title, description, price, filename}, {new: true})

        res.status(200).json({ ebook: newEbook })

    } catch (error) {
        next(error)
    }


})

module.exports = router;