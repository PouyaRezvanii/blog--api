const express = require('express')
const Ebook = require('../../models/ebook')

const router = express.Router()

router.get('/all', async (req, res, next) => {
    try {
        const ebooks = await Ebook.find()
        res.status(200).json({ ebooks })      
    } 
    catch (error) {
        next(error)
    }
})

router.get('/:ebookId', async (req, res, next) => {
    try {
        const ebook = await Ebook.findById( req.params.ebookId)
        res.status(200).json({ ebook })
    } catch (error) {
        next(error)
    }
})

module.exports = router;