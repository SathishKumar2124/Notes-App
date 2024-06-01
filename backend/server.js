require('dotenv').config()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const User = require('./models/userModel')
const Note = require('./models/noteModel')

const express = require('express')
const cors= require('cors')
const { authenticateToken } = require('./utils')

mongoose.connect(process.env.MONGO_URI).then(console.log("connected to database")).catch((err) => console.log(err))

const app = express()
app.use(express.json())
app.use(cors({
    origin:'*',
}))

app.get('/',(req,res)=>{
    res.json({msg:'hello'})
})

app.post('/createuser',async(req,res)=> {
    const {fullName,email,password} = req.body;
    if(!fullName){
        return res.status(400).json({
            error : true,
            msg : "please enter the Full Name"})
    }

    if(!email){
        return res.status(400).json({
            error : true,
            msg : "please enter the email"})
    }

    if(!password){
        return res.status(400).json({
            error : true,
            msg : "please enter the password"})
    }

    const isUserExists = await User.findOne({email : email})
    
    if(isUserExists){
        return res.status(400).json({
            error : true,
            message : 'User Already Exixts'})
    }

    const newUser = new User({
        fullName,
        email,
        password
    })

    await newUser.save()

    const accessToken = jwt.sign({newUser},
        process.env.ACCESS_TOKEN ,
        {
            expiresIn:'30m'
        }
        )

    res.json({
        error : false,
        newUser,
        accessToken,
        message : "Registration successFully"
    })

})

app.post('/login',async(req,res)=>{
    const {email,password} = req.body;

    if(!email){
        return res.status(400).json({
            msg : "please enter the email"})
    }

    if(!password){
        return res.status(400).json({
            msg : "please enter the password"})
    }

    const userInfo = await User.findOne({email})

    if(!userInfo){
        return res.status(401).json({
            msg : "user not found"
        })
    }

    if (userInfo.email == email &&  userInfo.password == password){
            const user = { user : userInfo}
            const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN,{
                expiresIn : "30m"
            })

            return res.json({
                error : false,
                message : "login success",
                email,
                accessToken
            })

    }else{
        return res.json({
            error : true,
            message : "InValid Credentials"
        })
    }

})

app.get('/get-user',authenticateToken,async(req,res)=>{
    const {user} = req.user

    const isUser = await User.findOne({_id : user._id})

    if(!isUser){
        return res.status(401)
    }

    return res.json({
        user : {
            fullName : isUser.fullName,
            email : isUser.email,
            _id : isUser._id,
            createdOn : isUser.createdOn
        },
        msg : ""
    })
})

app.post('/create-note',authenticateToken,async(req,res)=>{
    const {title,content,tags} = req.body;
    const {user} = req.user;

    if(!title){
        return res.status(400).json({error : true,msg : 'title is required'})
    }

    if(!content){
        return res.status(400).json({error : true,msg : 'content is required'})
    }

    try {
       const newNote = new Note({
        title,
        content,
        tags : tags || [],
        userId : user._id,
       }) 

       await newNote.save()

       return res.json({
        error : false,
        newNote,
        msg : "Note Added Successfully"
       })

    } catch (error) {
        return res.status(500).json({
            error : true,
            msg : "Internal server error"
        })
    }

})

app.put('/edit-note/:id',authenticateToken,async(req,res)=>{
    const id = req.params.id;
    const {title,content,tags,isPinned} = req.body;
    const {user} = req.user;

    if(!title && !content && !tags){
        return res.status(400).json({
            error : true,
            msg : "no changes provided"
        })
    }
    try {
        const note = await Note.findOne({_id : id , userId : user._id});
        if(!note){
            return res.status(404).json({
                error : true,
                msg : " note not found"
            })
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        if(isPinned) note.isPinned = isPinned;

        await note.save()

        return res.status(201).json({
            error : false,
            note,
            msg : "note updated successfully"

        })

    } catch (error) {
       return res.status(500).json({
        error : true,
        msg : "Internal server error"
       }) 
    }
})

app.get('/get-allnotes',authenticateToken,async(req,res)=>{
    const {user} = req.user;

    try {
        
        const notes = await Note.find({userId : user._id}).sort({isPinned : - 1})
        return res.json({
            error : false,
            notes,
            msg : "all notes retrived"
        })

    } catch (error) {
        return res.status(500).json({
            error : true,
            msg : "Internal server error"
        })
    }

})

app.delete('/delete-note/:id',authenticateToken,async(req,res)=>{
    const id = req.params.id;
    const {user}= req.user

    try {
        const note = await Note.findOne({_id : id , userId : user._id})

        if(!note){
            return res.status(404).json({
                error : true,
                msg : "note not found"
            })
        }

        await Note.deleteOne({_id : id , userId : user._id})

        return res.status(200).json({
            error : false,
            msg : "note deleted successfully"
        })

    } catch (error) {
        return res.status(500).json({
            error : true,
            msg : "Internal server error"
        }) 
    }

})

app.put('/update-note-pin/:id',authenticateToken,async(req,res)=>{
    const id = req.params.id;
    const {isPinned} = req.body;
    const {user} = req.user;


    try {
        const note = await Note.findOne({_id : id , userId : user._id});
        if(!note){
            return res.status(404).json({
                error : true,
                msg : " note not found"
            })
        }

        
        note.isPinned = isPinned || false;

        await note.save()

        return res.status(201).json({
            error : false,
            note,
            msg : "note updated successfully" 

        })

    } catch (error) {
       return res.status(500).json({
        error : true,
        msg : "Internal server error"
       }) 
    }
})

app.get('/search-note',authenticateToken,async(req,res)=>{
    const {user} = req.user;
    const {query} = req.query;

    if(!query){
        return res.status(400).json({
            error: true,
            message : "Search query is required"
        })
    }

    try {
        const matchingNotes = await Note.find({
            userId : user._id,
            $or: [
                { title : { $regex : new RegExp (query , "i")}},
              {content : {$regex : new RegExp( query , "i")}}  
            ]
       }) 

       return res.json({
        error : false,
        notes:matchingNotes,
        message : "Notes Retrived"
       })

    } catch (error) {
        return res.status(500).json({
            error : true,
            message : " Internal server error."
        })
    }

})

app.listen(8080,()=>{
    console.log('server is running on port 8080')
})