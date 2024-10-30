const express = require('express');

const Comment = require('../../models/comment');
const NotAuthorizedError = require('../../common/errors/not-authorized-error');
const NotFoundError = require('../../common/errors/not-found-error');

const router = express.Router();

router.delete('/delete/:commentId', async (req, res, next) => {
    const {commentId} = req.params

    if(!commentId){
        const error = new Error('comment id is requierd!')
        error.status = 400
        return next(error)
    }

    try {
        const comment = await Comment.findById(commentId)

        // not found
        if(!comment){
            throw new NotFoundError('document not found');
            // const error = new Error('document not found');
            // error.status = 404;
            // return next(error);
        }

        // not authorized
        if (comment.user.toString() !== req.currentUser.userId.toString()) {
            throw new NotAuthorizedError();
            // const error = new Error('Unauthorized');
            // error.status = 401;
            // return next(error);
        }

        const {deletedCount} = await Comment.deleteOne({_id: commentId, user: req.currentUser.userId})
        
        return res.status(200).json({ success: true })
    } catch (error) {
        console.log(error)
        return next(error)
    }

})

module.exports = router;