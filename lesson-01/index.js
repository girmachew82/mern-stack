const express = require('express')
const app = express()
const router = express.Router()
const port  = 10000
const path = require('path')

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
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})