const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName : {type :  String },
    email : {type : String ,
        unique : true
    
    },
    password : {type : String},
    createdOn : {
        type : Date ,
        default : new Date().getTime()
    }
})

const userModel = mongoose.model('User',userSchema)

module.exports = userModel