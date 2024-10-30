const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    title : {
        type: String,
        required : true,
    },

    content : {
        type: String,
        required : true,
    },

    excerpt : {
        type: String,
        required : true,
    },

    imageUrl : {
        type: String,
        required: true
    }
},
{
    timestamps :{
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
})

module.exports = mongoose.model('Post', postSchema)