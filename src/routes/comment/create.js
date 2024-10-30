const express = require('express');

const Comment = require('../../models/comment');
const BadRequestError = require('../../common/errors/bad-request-error');

const router = express.Router();

router.post('/:postId/create', async (req, res, next) => {
    const { postId } = req.params
    const { content } = req.body

    if(!postId || !content){
        // const error = new Error('all fields are required!')
        // error.status = 400
        // return next(error)
        return next(new BadRequestError('all fields are required!'))
    }

    

    try {
        const comment = new Comment({ user: req.currentUser.userId, post: postId, content })
        await comment.save()
        return res.status(200).json({ comment })
    } catch (error) {
        return next(error)
    }


})

module.exports = router;