const express = require('express')
const Ebook = require('../../models/ebook')
const BadRequestError = require('../../common/errors/bad-request-error')
const NotAuthorizedError = require('../../common/errors/not-authorized-error')
const fs = require('fs')

const router = express.Router()

router.delete('/delete/:ebookId', async (req, res, next) => {
    try {
        const ebook = await Ebook.findById(req.params.ebookId)
        if(!ebook) throw new BadRequestError('Document not found')

        // not authorized
        // if (ebook.user.toString() !== req.currentUser.userId.toString()) {
        //     throw new NotAuthorizedError();
        // }

        const { deleteCount } = await Ebook.deleteOne({ _id: req.params.ebookId, user: req.currentUser.userId })
        if(deleteCount === 0) throw new NotAuthorizedError();

        await Ebook.findOneAndUpdate({_id: req.currentUser.userId},
            {$pull: {ebooks: req.params.ebookId}})

        fs.unlink('private/ebooks/'+ebook.filename, (err) => {
            if (err) throw err
        })

        return res.status(200).json({ success: true })

    } catch (error) {
        next(error)
    }
})

module.exports = router;