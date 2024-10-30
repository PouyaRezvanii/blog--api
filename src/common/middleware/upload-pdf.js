const multer = require('multer')

const { v4: uuidv4 } = require('uuid')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'private/ebooks')
    },
    filename: (req, file, cb) => {
        const filename = uuidv4() + '_' + file.originalname.replace(/\//g, '_')
        cb(null, filename)
    }
})

const fileFilter = (req, file, cb) => {
    //const type = file.mimetype;
    if(file.mimetype !== 'application/pdf'){
        return cb(null, false)
    }
    
    cb(null, true)

}

module.exports = multer({ storage, fileFilter }).single('ebook') //middleware