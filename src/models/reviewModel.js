const moment = require('moment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const reviewSchema = new mongoose.Schema({
    bookId : {type: ObjectId,required : true,ref: 'books'},
    reviewedBy : {type:String,default:'Guest'},
    reviewedAt : {type:Date,default : moment().format('YYYY-MM-DD')},
    rating : Number,
    review:String,
    isDeleted:{type : Boolean, default : false}
},{versionKey:false}
)
module.exports = mongoose.model('review', reviewSchema)
