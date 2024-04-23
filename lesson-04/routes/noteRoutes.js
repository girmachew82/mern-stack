const express = require('express')
const router = express.Router()
const path = require('path')
const noteController = require('../controllers/noteControlers')
/////router.route('/')
    router.get("/",noteController.getAllNotes)
    router.get("/:noteId",noteController.getNoteById)
    router.post("/",noteController.createNewNote)
    router.patch("/",noteController.updateNote)
    router.delete("/",noteController.deleteNote)


module.exports = router