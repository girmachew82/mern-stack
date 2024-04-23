const express = require('express')
const router = express.Router()
const path = require('path')
const noteController = require('../controllers/noteControlers')
const verifyJWT = require('../middleware/verifyJWT')
router.use(verifyJWT)
router.route('/')
    .get(noteController.getAllNotes)
    .post(noteController.createNewNote)
    .patch("/",noteController.updateNote)
    router.delete("/",noteController.deleteNote)

router.route('/:noteId')    
    .get(noteController.getNoteById)




module.exports = router