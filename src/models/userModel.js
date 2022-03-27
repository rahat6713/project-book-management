const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    title : {type : String,trim : true,required : true,enum : ["Mr", "Mrs", "Miss"]},
    name : {type: String,required: true,trim : true},
    phone : {type : String,required: true,unique: true},
    email : {type : String,required:true,unique : true},
    password : {type : String,required : true}
}, { timestamps: true,versionKey:false })
module.exports = mongoose.model('user', userSchema)