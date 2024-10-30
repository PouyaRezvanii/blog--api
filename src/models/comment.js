const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    post:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    
    content:{
        type:String,
        required: true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Comment', commentSchema)