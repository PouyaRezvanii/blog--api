const express = require('express');

const Comment = require('../../models/comment');
const user = require('../../models/user');
const NotAuthorizedError = require('../../common/errors/not-authorized-error');
const NotFoundError = require('../../common/errors/not-found-error');

const router = express.Router();

router.post('/update/:commentId', async (req, res, next) =>{
    const { commentId } = req.params

    const { content } = req.body

    if(!commentId || !content){
        const error = new Error('invalid request')
        error.status = 400
        return next(error)
    }

    try {
        const comment = await Comment.findById(id)

        if(!comment){
            throw new NotFoundError('document not found');
            // const error = new Error('document not found');
            // error.status = 404;
            // return next(error);
        }

        if (comment.user.toString() !== req.currentUser.userId.toString()) {
            throw new NotAuthorizedError();
            // const error = new Error('Unauthorized');
            // error.status = 401;
            // return next(error);
        }

        // const {modifiedCount} = 
        await Comment.updateOne(
            {_id: commentId, user: req.currentUser.userId},
            { content })

        return res.status(200).json({ newComment })
    } catch (error) {
        return next(error)
    }

})



module.exports = router;