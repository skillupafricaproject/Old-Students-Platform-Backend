const express = require('express')
require('dotenv').config()
require('express-async-errors')
const mongoose = require('mongoose')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const helmet = require ('helmet')
const fetch = require ('node-fetch');
//const mongoSanitize = require('express-mongo-sanitize')

const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
const app = express()
const fileUpload = require ('express-fileupload')
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors())
app.use(helmet())
app.use(fileUpload({ useTempFiles: true }))


//routers
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const schoolRouter = require('./routes/school')

//error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler")

// app.use((req, res, next) => {
//     req.requestTime = new Date().toISOString();
//     console.log("Starting")
//     next()
// })

app.get("", (req, res)=>{
    res.redirect("")
})
// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/school', schoolRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
    try {
    mongoose.connect(process.env.MONGO_URI, 
    ()=>{console.log('Database is connected')})

app.listen(port, ()=>{console.log(`Server is running on http:\\localhost:${port}`)})
    } catch (error) {
        console.log(error)
    }
};

start()