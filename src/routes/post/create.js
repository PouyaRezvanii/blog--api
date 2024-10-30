const express = require('express')
const Post = require('../../models/post')
const { check, validationResult } = require('express-validator');
const RequsetValidationError = require('../../common/errors/request-validation-error');
const validationRequest = require('../../common/middleware/validation-request');
const uploadImg = require('../../common/middleware/upload-img');
const BadRequestError = require('../../common/errors/bad-request-error');
const { getSocketIo } = require('../../socketIo');
const sharp = require('sharp')
const fs = require('fs')
const path = require('path');

const router = express.Router();

router.post('/create', uploadImg,
    check(['title', 'content', 'excerpt'], 'all fields are required')
        .notEmpty(),
    validationRequest,
    async (req, res, next) => {

    // // validation 
    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     // const error = new Error(errors.array()[0].msg) //first element of error array and select msg
    //     // error.status = 400;
    //     // return next(error);
    //     return next(new RequsetValidationError(errors.array()))
    // }

    console.log(req.currentUser)
    const {title, content, excerpt} = req.body;

    

    //check notEmpty fields
    // if(!title, !content, !excerpt){
    //     const error = new Error('all fields are required!')
    //     error.status = 400

    //     return next(error)
    //     // return res.status(400).json({error: 'bad request!'})
    // }

    const io = getSocketIo()

    try {

        if(req.file){

            sharp('upload/' + req.file.filename)
                //.toFormat('png')
                //.png({ compressionLevel: 9 }) // max level of compression
                .jpeg({ quality: 80 })
                .resize(400, 300, { fit: 'inside' })
                .composite([{ input: 'public/blog-logo.jpg', gravity: 'southeast' }]) // watermark
                .toFile('upload/' + 'processed__' + req.file.filename, (err, info) => {
                    if(err) throw err

                    setTimeout(() => {
                        fs.unlink(path.join('upload/', req.file.filename), (err) => {
                            if (err) console.error("Failed to delete file:", err);
                        });
                    }, 100);
                })

            const imageUrl = "upload/" + "processed__" + req.file.filename;

            const post = new Post({
                title, imageUrl, content, excerpt, user: req.currentUser.userId
            })
            await post.save();

            io.emit('new-post', {postId: post._id, title: post.title})

            res.status(200).json({ post })
        } 
        else {
            throw new BadRequestError('only png and jpg')
        }

    } catch (error) {
        return next(error)
        //return res.status(500).json({error: 'something went wrong'})
    }

    
})

module.exports = router;