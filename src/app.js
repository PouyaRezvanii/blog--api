const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const cookieSession = require('cookie-session')


// post route
const createPostRoute = require('./routes/post/create')
const readPostRoute = require('./routes/post/read')
const updatePostRoute = require('./routes/post/update')
const deletePostRoute = require('./routes/post/delete')

// comment route
const createCommentRoute = require('./routes/comment/create')
const readCommentRoute = require('./routes/comment/read')
const updateCommentRoute = require('./routes/comment/update')
const deleteCommentRoute = require('./routes/comment/delete')

// ebook
const createEbookRoute = require('./routes/ebook/create')
const updateEbookRoute = require('./routes/ebook/update')
const readEbookRoute = require('./routes/ebook/read')
const deleteEbookRoute = require('./routes/ebook/delete')
const purchaseEbookRoute = require('./routes/ebook/purchase')
const downloadEbookRoute = require('./routes/ebook/download')




// auth route
const signupRoute = require('./routes/auth/signup')
const signinRoute = require('./routes/auth/signin')
const signoutRoute = require('./routes/auth/signout')
const currentUserRoute = require('./routes/auth/current-user')

// Authorize
const currentUser = require('./common/middleware/current-user');

const CustomError = require('./common/errors/custom-error');
const NotFoundError = require('./common/errors/not-found-error');
//console.log(new CustomError('test'))

const helmet = require('helmet')   // headers for security
const compression = require('compression')  // compression data
const morgan = require('morgan')  // log
const fs = require('fs')
const cors = require('cors')

const app = express()

app.use(helmet());
app.use(compression());

const accessLogStream = fs.createWriteStream(__dirname+ '/../access.log', { flags: 'a' })

app.use(morgan("combined", { stream: accessLogStream }));

const ORIGIN_URL =
    process.env.NODE_ENV !== 'production'
    ? "http://localhost:3000" 
    : process.env.PRODUCTION_URL

//console.log( ORIGIN_URL,  process.env.NODE_ENV)

app.use(
    cors({
        origin: ORIGIN_URL,
        credentials: true,
        //methods: ['POST', 'GET']
})
);

app.set('trust proxy', true)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// after this 2 we use cookie-session
app.use(cookieSession({
    signed: false,
    secure: false
}))

app.use('/upload', currentUser, express.static('upload'))
app.use('/public', express.static('public'))


app.use('/auth/',
    signupRoute,
    signinRoute,
    signoutRoute,
    currentUser, // har chizi ke zire in bashe niaz be signin dare.
    currentUserRoute
)

app.use('/posts/',
    readPostRoute,
    currentUser,
    createPostRoute,
    updatePostRoute,
    deletePostRoute
);

app.use('/comment/',
    readCommentRoute,
    currentUser,
    createCommentRoute,
    updateCommentRoute,
    deleteCommentRoute
)

app.use('/ebook/',
    readEbookRoute,
    currentUser,
    createEbookRoute,
    updateEbookRoute,
    deleteEbookRoute,
    purchaseEbookRoute,
    downloadEbookRoute
)


// 404 not found
app.all("*", (req, res, next) => {
    next(new NotFoundError())
    // const error = new Error('not found')
    // error.status = 404;
    // return next(error)
})

// error handling . . .
app.use((err, req, res, next) => {
    if(process.env.NODE_ENV === 'production'){
        console.log(err)
    }
    if(err instanceof CustomError){
        res.status(err.statusCode).json({errors : err.generateErrors()})
    }

    res.status(500).json({errors: [{message: 'something went wrong'}]})
})



// mongoose.connect('mongodb+srv://admin:NyUMADRXCZVKlijk@cluster0.chmto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
//   .then(() => {
//     app.listen(3000, () => {
//       console.log("Server is up and running on port 3000");
//     });
//   })
//   .catch(err => {
//     console.error('Database connection failed:', err); // خطای اتصال به پایگاه داده را در کنسول چاپ می کند
//     // در اینجا می توانید اقدامات دیگری مانند ارسال اعلان یا تلاش مجدد برای اتصال انجام دهید
//   });

module.exports = app;