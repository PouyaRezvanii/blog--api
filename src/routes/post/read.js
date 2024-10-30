const express = require('express');

const Post = require('../../models/post');
const { query } = require('express-validator');
const BadRequestError = require('../../common/errors/bad-request-error');
const validationRequest = require('../../common/middleware/validation-request');
const { getSocketIo } = require('../../socketIo');

const router = express.Router();

const validators = [
    query('page')
        .notEmpty()
        .withMessage('page must not be empty')
        .isInt({min: 1})
        .withMessage('page must be a postive integer'),

    query('postsPerPage')
        .isInt({min: 1, max: 2 })
        .withMessage('posts per page must be postive and not be greater than 2')
]

router.get('/all', validators, validationRequest, async (req, res, next) => {

    const { page, postsPerPage } = req.query
    console.log(req.query)

    const io = getSocketIo()

    io.emit('reading', 'reading all posts')

    try {
        const totalPosts = await Post.countDocuments();
        

        const totalPages = Math.ceil(totalPosts / postsPerPage)

        //console.log(totalPosts, totalPages)

        const posts = await Post.find()
            .sort('-created_at') // jadad tarin balatar
            .skip((page-1) * postsPerPage)
            .limit(postsPerPage)

        res.status(200).json({ totalPosts, totalPages, page, posts })

    } catch (error) {
        return next(error)
       // return res.status(500).json({error: 'something went wrong'})
    }

})
// مسیر های تکی باید بعد مسیر همه پست ها باشد تا بتواند به درستی پاسخ دهد. میتوانی با جابجایی به بالا روند را ببینی
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    if(!id) {
        throw new BadRequestError('post id is required')
        // const error = new Error('id is required')
        // error.status = 400;
        // return next(error)

       // return res.status(400).json({error: 'bad request!'})
    }

    try {
        post = await Post.findById(id);
    } catch (error) {
        return next(error)
        //return res.status(500).json({error: 'something went wrong!'})
    }

    res.status(200).json({ post })

})

module.exports = router;