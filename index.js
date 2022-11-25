const express = require('express')
const dotenv = require('dotenv')
const userRouter = require('./routes/user')
const schoolRouter = require('./routes/school')
const mongoose = require('mongoose')
const cors = require('cors')
//const mg = require('mailgun.js')


dotenv.config()
const app = express()

app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next()
})


const port = process.env.PORT || 3000
app.use('/api/v1/', userRouter)
app.use('/api/v1/', schoolRouter)


mongoose.connect(process.env.MONGO_URI, 
    ()=>{console.log('Database is connected')})

app.listen(port, ()=>{console.log(`Server is running on http:\\localhost:${port}`)})