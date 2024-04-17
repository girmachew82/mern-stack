const express = require('express')
const app = express()
const router = express.Router()
const port  = 3003
const path = require('path')
const {logger} = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
//custom middleware
app.use(logger)
//builtin middleware
app.use(express.json())
//3rd party middleware
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname,'public')))

app.use('/', require('./routes/root'))
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
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})