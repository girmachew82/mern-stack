const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username:{type: String,requred: true},
    password:{type:String, required:true},
    roles:[{type:String, default:"Employee",required:true}],
    active:{type:Boolean, default: true}
},
{
    timestamps: true
})

module.exports = mongoose.model('User',userSchema)