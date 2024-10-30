const mongoose = require('mongoose')
const bcrypt  = require('bcryptjs')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    ebooks: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Ebook'}
    ]
},
{
    timestamps: true
})

userSchema.pre('save', async function(done){
    if(this.isModified('password') || this.isNew){
        const saltRounds = 10 // number of salt rounds
        const hashedPassword = await bcrypt.hash(this.get('password'), saltRounds)

        this.set('password', hashedPassword)
    }
    done();
})

module.exports = mongoose.model('User', userSchema);