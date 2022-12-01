const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const helmet = require ('helmet')
//const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
//const mg = require('mailgun.js')


const app = express()
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors())
app.use(xss())

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