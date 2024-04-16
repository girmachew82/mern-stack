const express = require('express')
const app = express()
const router = express.Router()
const port  = 10000

app.get('/',(req, res)=>{
    res.send("Hello World")
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})