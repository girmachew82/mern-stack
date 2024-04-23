require('dotenv').config()
const express = require('express')
const app = express()
const port  = 3003
const path = require('path')
const {logger, logEvents} = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors  = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')

console.log(process.env.NODE_ENV)
connectDB()
//custom middleware
app.use(logger)
//builtin middleware
app.use(express.json())
//3rd party middleware
app.use(cookieParser())
app.use(cors())

app.use('/', express.static(path.join(__dirname,'public')))

app.use('/', require('./routes/root'))
app.use('/auths',require('./routes/authRoutes'))
app.use('/users',require('./routes/userRoutes'))
app.use('/notes',require('./routes/noteRoutes'))
app.all('*',(req, res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts('json')){
        res.json({
            message:"404 Not found"
        })
        }else{
            res.type('txt').send('404 Not Found')
        }
})
app.get('/',(req, res)=>{
    res.send("Hello World")
})
//custom middleware
app.use(errorHandler)

mongoose.connection.once('open',()=>{
    console.log(`Connected to MongoDB`)
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`)
    })
})
mongoose.connection.on('error', err =>{
    console.log(err)
    logEvents(`${err.no} \t${err.code}\t${req.syscall}\t${req.hostname}`,'mongoErrorLog.log')

})