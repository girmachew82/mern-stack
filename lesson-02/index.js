const express = require('express')
const app = express()
require('dotenv').config()
const {logger} = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')

const port = process.env.PORT

//custom middleware
app.use(logger)

app.use(express.json())
app.use(cookieParser())
app.get('/',(req, res)=>{
    res.send("Hello World")
})
//custom middleware
app.use(errorHandler)
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})