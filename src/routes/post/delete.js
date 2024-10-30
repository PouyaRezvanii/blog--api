const express = require('express');

const router = express.Router();

const Post = require('../../models/post');
const NotAuthorizedError = require('../../common/errors/not-authorized-error');
const NotFoundError = require('../../common/errors/not-found-error');

router.delete('/delete/:id', async (req, res, next) => {
    const { id } = req.params

    if(!id)
        {
            const error = new Error('id is required!')
            error.status = 400

            return next(error)
            //return res.status(400).json({error: 'bad request'})
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

        const { deleteCount } = await Post.deleteOne({ _id: id, user: req.currentUser.userId }) //Post.findOneAndDelete({ _id: id})
        
        console.log(deleteCount)
        
        // if(!deleteCount){
        //     const error = new Error('not Authorized');
        //     error.status = 401;
        //     return next(error);
        // }


        return res.status(200).json({ success: true })       
    } catch (error) {
        return next(error)
        //return res.status(500).json({error: 'something went wrong!'})
    }

})

module.exports = router