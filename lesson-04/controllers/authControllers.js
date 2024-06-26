const User = require('../models/User')
const asynchHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// @desc Login
// @route POST /auth
// @access public
const login = asynchHandler(async(req, res) =>{
    const {username, password } = req.body

    if(!username || !password){
        return res.status(400).json({message:"All fields are required"})
    }

    const foundUser = await User.findOne({username}).exec()

    if(!foundUser || !foundUser.active){
        return res.status(401).json({message:"Unauthorized"})
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if(!match) return res.status(401).json({message:"Unaothorized"})


    const accessToken = jwt.sign(
        {
            "UserInfo":{
                "username":foundUser.username,
                "roles": foundUser.roles
            }

        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '10s'}
    )

    const refreshToken = jwt.sing(
        {'username':foundUser.username},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'1d'}
    )

    //create secure cookies with refersh token
    res.cookie('jwt', refreshToken,{
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    //send accessToken containing username and roles
    res.json(accessToken)
})
// @desc Refresh
// @route GET /auth/refresh
// @access public - because access token has expired
const refresh = asynchHandler(async(req, res) =>{
const cookies = req.cookies

if(!cookies?.jwt)
return res.status(401).json({
    message:"Unauthorized"
})

const refreshToken = cookies.jwt

jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asynchHandler(async (err, decoded)=>{
        if(err){
            return res.status(403).json({message:"Forbidden"})
        }

        const foundUser = await User.findOne({username: decoded.username})
        if(!foundUser){
            return res.status(401).json({message:"Unauthorized"})
        }

        const accessToken = jwt.sign(
            {
                "UserInfo":{
                    "username":foundUser.username,
                    "roles": foundUser.roles
                }
    
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '10s'}
            
        )

        res.json({accessToken})
    })

)
})
// @desc Logout
// @route POST /auth/logout
// @access public - just clear cookies if exists
const logout = asynchHandler(async(req, res) =>{
    const cookies = req.cookies
    if(!cookies?.jwt){
        return res.sendStatus(204)//No content
    }
    res.clearCookie('jwt',{httpOnly:true, sameSite:'None',secure:true})
    res.json({message:"Cookie cleared"})
})

module.exports ={login, refresh, logout}