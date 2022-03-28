const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;
const moment = require('moment')

const bookSchema = new mongoose.Schema({
    title : {type : String,required :true,unique : true,trim : true},
    excerpt :{type:String,required:true},
    userId: {type: ObjectId,required:true,ref : 'users'},
    ISBN : {type : String,required:true,unique:true},
    category: {type: String,required : true,},
    subcategory : {type : String,required : true},
    review:{type : Number,default:0},
    deletedAt : String,
    isDeleted : {type : Boolean,default : false},
    releasedAt :  {type : String,default : moment().format('YYYY-MM-DD')}
},
{ timestamps: true, versionKey:false }
);
module.exports = mongoose.model('book', bookSchema)


