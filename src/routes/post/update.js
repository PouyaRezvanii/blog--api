const express = require('express')
const Post = require('../../models/post');
const user = require('../../models/user');
const NotAuthorizedError = require('../../common/errors/not-authorized-error');
const NotFoundError = require('../../common/errors/not-found-error');

const router = express.Router();

router.post('/update/:id', async (req, res, next) => {
    const { id } = req.params;
    const { title, content, excerpt } = req.body;

    if((!title && !content && !excerpt) || !id) {
        const error = new Error('all fields are required')
        error.status = 400;

        return next(error)
        //return res.status(400).json({ error: 'bad request' })
    }

    try {
        const post = await Post.findById(id)

        if(!post){
            throw new NotFoundError('document not found');
            // const error = new Error('document not found');
            // error.status = 404;         
            // return next(error);
        }

        if (post.user.toString() !== req.currentUser.userId.toString()) {
            throw new NotAuthorizedError();
            // const error = new Error('Unauthorized');
            // error.status = 401;
            // return next(error);
        }

        //const { modifiedCount } = 
        await Post.updateOne({ _id: id, user: req.currentUser.userId }, {
            title, content, excerpt
        })

        // if(!modifiedCount){
        //     const error = new Error('not Authorized');
        //     error.status = 401;
        //     return next(error);
        // }

        return res.status(200).json({ post })

    } catch (error) {
        return next(error)
        //return res.status(500).json({error: 'something went wrong!'})
    }

})

module.exports = router;