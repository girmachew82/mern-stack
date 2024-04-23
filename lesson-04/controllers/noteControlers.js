const User = require('../models/User')
const Note = require('../models/Note')
const asynchHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


// @desc GET all notes
// @route GET /notes
// @access Private
const getAllNotes = asynchHandler(async (req, res) =>{
    const notes = await Note.find().populate('user','email').exec()
    if(!notes){
        return res.status(404).json({
            message:"No note found"
        })
    }
    res.json({
        count: notes.length,
        allNotes: notes.map(note =>{
            return{
            user:note.user,
            id: note._id,
            title: note.title,
            text: note.text,
            completed: note.completed
            ,
            request:{
                type:'GET',
                url:"127.0.0.1:3003/notes/"+note._id
              }
            }
        })
    })
})
// @desc  create a new note
// @route POST /notes
// @access Private
const createNewNote = asynchHandler(async (req, res) =>{
    const {user, title, text} = req.body
    //confirmation
    if(!user || !title ||  !text) {
        return res.status(400).json({message:"All fields are required"})
    }
    //check for duplication
   const duplicate = await Note.findOne({title}).lean().exec()
    if(duplicate){
        res.status(409).json({
            message:"Duplicate note"
        })
    }
   
    const noteObject = {user, title, text}
    //create and store new note
    const note = await Note.create(noteObject)
    if(note){
        return res.status(201).json({
            message:"Note created",
           
                title:title,
                text:text,
                request:{
                    type:'GET',
                    url:"127.0.0.1:3003/notes/"  
                }
        })
    }else{
        return res.status(400).json({message:"Invalid note data"})
    }
})
// @desc update a notes
// @route PATCH /notes
// @access Private
const updateNote = asynchHandler(async (req, res) =>{
   
    const {id, user, title, text, completed} = req.body
    const note = await Note.findById(id).exec()
    if(!note){
        return res.status(404).json({
            message:"Note not found"
        })
    }
     //confirmation
     if(!id || !user ||  !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({message:"All fields are required"})
    }
    
     //check for duplication
   const duplicate = await Note.findOne({title}).lean().exec()
   if(duplicate && duplicate?._id.toString() !==id){
       return res.status(409).json({ message:"Duplicate note title" })
   }

   note.title = title
   note.text = text
   note.completed = completed
   
   const updateNote = await note.save()

   res.json({message:`${updateNote.title} updated`})
   
})
// @desc delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asynchHandler(async (req, res) =>{
const { id } = req.body
if(!id){
    return res.status(404).json({message:"Note ID required"})
}
const note = await Note.findById(id).exec()

if(!note){
    return res.status(400).json({message:"Note not found"})
}

const result = await note.deleteOne()

const reply = `Note ${note.title} with ID ${note._id} deleted`

res.json(reply)
})

// @desc GET a note
// @route GET /notes/:noteID
// @access Private
const getNoteById = asynchHandler(async (req, res) =>{
   
    const  noteId = req.params.noteId

    if(!noteId){
        return res.status(404).json({message:"Note ID required"})
    }
    const note = await Note.findById(noteId).exec()
    if(!note){
        return res.status(400).json({message:"Note not found"})
    }else{
        return res.status(200).json({
            _id:note._id,
            title: note.title,
            text:note.text
        })
    }
 
})


module.exports ={getAllNotes, createNewNote, updateNote, deleteNote, getNoteById}