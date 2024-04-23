const express = require('express')
const router = express.Router()
const path = require('path')
const userController = require('../controllers/userControlers')
const verifyJWT = require('../middleware/verifyJWT')
router.use(verifyJWT)
/////router.route('/')
    router.get("/",userController.getAllUsers)
    router.get("/:userId",userController.getUserById)
    router.post("/",userController.createNewUser)
    router.patch("/",userController.updateUser)
    router.delete("/",userController.deleteUser)


module.exports = router