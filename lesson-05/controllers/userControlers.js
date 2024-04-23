const User = require('../models/User')
const Note = require('../models/Note')
const asynchHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


// @desc GET all users
// @route GET /users
// @access Private
const getAllUsers = asynchHandler(async (req, res) =>{
    const users = await User.find().select('-password').lean()
    if(!users){
        return res.status(404).json({
            message:"No user found"
        })
    }
    res.json(users)
})
// @desc  create a new user
// @route POST /users
// @access Private
const createNewUser = asynchHandler(async (req, res) =>{
    const {username, password, roles} = req.body
    //confirmation
    if(!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message:"All fields are required"})
    }
    //check for duplication
   const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate){
        res.status(409).json({
            message:"Duplicate username"
        })
    }
    //Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) 
    const userObject = {username, "password":hashedPwd, roles}
    //create and store new user
    const user = await User.create(userObject)
    if(user){
        return res.status(201).json({message:"User created"})
    }else{
        return res.status(400).json({message:"Invalid user data"})
    }
})
// @desc update a users
// @route PATCH /users
// @access Private
const updateUser = asynchHandler(async (req, res) =>{
   
    const {id, username, password, active, roles} = req.body
    const user = await User.findById(id).exec()
    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }
     //confirmation
     if(!id || !username ||  !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({message:"All fields are required"})
    }
    
     //check for duplication
   const duplicate = await User.findOne({username}).lean().exec()
   if(duplicate && duplicate?._id.toString() !==id){
       return res.status(409).json({ message:"Duplicate username" })
   }

   user.username = username
   user.roles = roles
   user.active = active
   if(password){
    user.password = await bcrypt.hash(password, 10)
   }

   const updateUser = await user.save()

   res.json({message:`${updateUser.username} updated`})
   
})
// @desc delete a user
// @route DELETE /users
// @access Private
const deleteUser = asynchHandler(async (req, res) =>{
const { id } = req.body
if(!id){
    return res.status(404).json({message:"User ID required"})
}
const note = await Note.findOne({user: id}).lean().exec()
if(note){
    return res.status(400).json({message:"User has assigned notes"})
}

const user = await User.findById(id).exec()

if(!user){
    return res.status(400).json({message:"User not found"})
}

const result = await user.deleteOne()

const reply = `Username ${user.username} with ID ${user._id} deleted`

res.json(reply)
})

// @desc GET a user
// @route GET /users/:userID
// @access Private
const getUserById = asynchHandler(async (req, res) =>{
   
    const  userId = req.params.userId

    if(!userId){
        return res.status(404).json({message:"User ID required"})
    }
    const user = await User.findById(userId).exec()
    if(!user){
        return res.status(400).json({message:"User not found"})
    }else{
        return res.status(200).json({
            _id:user._id,
            username: user.username
        })
    }
 
})


module.exports ={getAllUsers, createNewUser, updateUser, deleteUser, getUserById}