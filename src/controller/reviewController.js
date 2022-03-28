const bookModel = require('../models/bookModel')
const ObjectId = require('mongoose').Types.ObjectId
const reviewModel = require('../models/reviewModel')

const createReview = async function(req,res){
    let bookId = req.params.bookId;
    if(!bookId) return res.status(400).send({status:false,msg:"bookId is not present in the params"})
    if(!ObjectId.isValid(bookId)) return res.status(400).send({status:false,msg:"bookId in params is invalid"})
    let book = await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!book) return res.status(400).send({status:false,msg:"book with specific bookId is not present"})
    
    let reviewData = req.body
    if(!reviewData.bookId) return res.status(400).send({status:false,msg:"bookId in body is not present in the body"})
    if(!ObjectId.isValid(reviewData.bookId)) return res.status(400).send({status:false,msg:"bookId in body is invalid"})
    let books = await bookModel.findOne({_id:reviewData.bookId,isDeleted:false})
    if(!books) return res.status(400).send({status:false,msg:"book with specific bookId is not present"})
    if(bookId != reviewData.bookId) return res.status(400).send({status:false,msg:'bookId in params and body do not match'})

    if(!reviewData.reviewedBy) return res.status(400).send({status:false,msg:'reviewedBy is not present'})
    if(Object.keys(reviewData).includes('reviewedAt')){
        if(!(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(reviewData.reviewedAt))){
            return res.status(400).send({status:false,msg:"reviewed Date is not valid"})
        }
    }
    if(!reviewData.rating) return res.status(400).send({status:false,msg:'rating is not present'})
    let data = await reviewModel.create(reviewData)
    let bookUpdate = await bookModel.findOneAndUpdate({_id:bookId, isDeleted:false}, {$inc: {review : 1}})    
    return res.status(201).send({status:true,msg:"success",data:data})
}

const updateReview = async function(req,res){
    if(Object.keys(req.body).length == 0) return res.status(400).send({status:false,msg:"enter the details to update the review"})
    let bookId = req.params.bookId;
    if(!bookId) return res.status(400).send({status:false,msg:"bookId is not present in the params"})
    if(!ObjectId.isValid(bookId)) return res.status(400).send({status:false,msg:"bookId in params is invalid"})
    let book = await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!book) return res.status(400).send({status:false,msg:"book with specific bookId is not present"})
    
    let reviewId = req.params.reviewId;
    if(!reviewId) return res.status(400).send({status:false,msg:"reviewId is not present in the params"})
    if(!ObjectId.isValid(reviewId)) return res.status(400).send({status:false,msg:"reviewId in params is invalid"})
    let review = await reviewModel.findOne({_id:reviewId,isDeleted:false})
    if(!review) return res.status(400).send({status:false,msg:"review with specific reviewId is not present"})
    // Get review details like review, rating, reviewer's name in request body.
    let reviewData = req.body
    book = book.toObject()
    let updated = await reviewModel.findByIdAndUpdate({_id:reviewId,status:false}, {$set:{review:reviewData.review, rating:reviewData.rating,reviewedBy:reviewData.reviewedBy}})
    let allReviews = await reviewModel.find({bookId:bookId,isDeleted:false})
    book.reviewsData = allReviews
    return res.status(200).send({status:true,msg:"success",data:book})
}

const deleteReview = async function(req,res){
    
    let reviewId = req.params.reviewId;
    if(!reviewId) return res.status(400).send({status:false,msg:"reviewId is not present in the params"})
    if(!ObjectId.isValid(reviewId)) return res.status(400).send({status:false,msg:"reviewId in params is invalid"})
    let review = await reviewModel.findOne({_id:reviewId,isDeleted:false})
    if(!review) return res.status(400).send({status:false,msg:"review with specific reviewId is not present"})

    let bookId = req.params.bookId;
    if(!bookId) return res.status(400).send({status:false,msg:"bookId is not present in the params"})
    if(!ObjectId.isValid(bookId)) return res.status(400).send({status:false,msg:"bookId in params is invalid"})
    let book = await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!book) return res.status(400).send({status:false,msg:"book with specific bookId is not present"})

    let updated = await reviewModel.findByIdAndUpdate({_id:reviewId,status:false}, {$set:{isDeleted:true}})
    let bookUpdate = await bookModel.findOneAndUpdate({_id:bookId, isDeleted:false}, {$inc: {review : -1}}) 
    return res.status(200).send()
}
module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview