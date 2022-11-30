const express = require('express')
const dotenv = require('dotenv')
const userRouter = require('./routes/user')
const schoolRouter = require('./routes/school')
const mongoose = require('mongoose')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const helmet = require ('helmet')
//const mongoSanitize = require('express-mongo-sanitize')
//const xss = require('xss-clean')
//const mg = require('mailgun.js')


dotenv.config()
const app = express()
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors())

// Data sanitization against noSql query injection
//app.use(mongoSanitize)

// Data sanitization against xss
//app.use(xss)

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log("Starting")
    next()
})


const port = process.env.PORT || 3000
app.use('/api/v1/', userRouter)
app.use('/api/v1/', schoolRouter)


mongoose.connect(process.env.MONGO_URI, 
    ()=>{console.log('Database is connected')})

app.listen(port, ()=>{console.log(`Server is running on http:\\localhost:${port}`)})