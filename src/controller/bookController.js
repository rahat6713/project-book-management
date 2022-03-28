const bookModel = require('../models/bookModel');
const reviewModel = require('../models/reviewModel');
const ObjectId = require('mongoose').Types.ObjectId
const userModel = require('../models/userModel')

const createBooks = async function(req,res){
    try{let bookData = req.body;
    if(Object.keys(bookData).length == 0) return res.status(400).send({status : false, msg : "Pleasse enter the details of the book"})

    // Validation of title
    if(!bookData.title) return res.status(400).send({status:false,msg:"enter the title of the book"})
    if(typeof(bookData.title) != typeof(' ')) return res.status(400).send({status:false,msg:`enter title in the proper format`})
    if(bookData.title.trim().length == 0) return res.status(400).send({status:false,msg:`enter title in the proper format`})
    let dupTitle = await bookModel.findOne({title:bookData.title, isDeleted:false})
    if(dupTitle) return res.status(400).send({status:false,msg:"Book with this title is already present"})

    // validation of excerpt
    if(!bookData.excerpt) return res.status(400).send({status:false,msg:"enter the excerpt of the book"})
    if(typeof(bookData.excerpt) != typeof(' ')) return res.status(400).send({status:false,msg:`enter excerpt in the proper format`})
    // Validation of userId
    if(!bookData.userId) return res.status(400).send({status:false,msg:'enter the userId of the book'})
    if(!ObjectId.isValid(bookData.userId)) return res.status(400).send({status:false,msg:'userId is not valid'})
    let user = await userModel.findOne({_id:bookData.userId})
    if(!user) return res.status(400).send({status : false, msg: 'user with this userId doesnot exist'})

    // Validation of ISBN
    if(!bookData.ISBN) return res.status(400).send({status:false,msg:'enter the ISBN of the book'})
    if(typeof(bookData.ISBN) != typeof(' ')) return res.status(400).send({status:false,msg:`enter ISBN in the proper format`})
    let dupISBN = await bookModel.findOne({ISBN : bookData.ISBN})
    if(dupISBN) return res.status(400).send({status : false, msg: 'book with this ISBN already exist'})

    // Validation of category
    if(!bookData.category) return res.status(400).send({status : false, msg: 'enter the category of the book'})
    if(typeof(bookData.category) != typeof(' ')) return res.status(400).send({status:false,msg:`enter category in the proper format`})

    if(!bookData.subcategory) return res.status(400).send({status : false, msg: 'enter the subcategory of the book'})
    if(typeof(bookData.subcategory) != typeof(' ')) return res.status(400).send({status:false,msg:`enter subcategory in the proper format`})
    // format of regx == "YYYY-MM-DD"
    if(Object.keys(bookData).includes('releasedAt')){
        if(!(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(bookData.releasedAt))){
            return res.status(400).send({status:false,msg:"released Date is not valid"})
        }
    }
    
    let data = await bookModel.create(bookData)
    return res.status(201).send({status:true,msg:'success',data : data})
}catch(error){
    return res.status(500).send({status:false,msg:error.message})
}
}


const getBooks = async function(req,res){
    if(Object.keys(req.query).length == 0){
        let data = await bookModel.find({isDeleted:false}).collation({locale: "en" }).sort({title:1}).select({title:1,excerpt:1,userId:1,category:1,releasedAt:1,review:1})
        if(!data) return res.status(404).send({status:false,msg:"no book found"})
        return res.status(200).send({status:true,msg:"success",data:data})
    }

    let filterCondition = req.query;
    Object.values(filterCondition).map(item => item.trim())
    let filter = ['userId','category','subcategory']
    for(let i=0;i<Object.keys(filterCondition).length;i++){
        if(!filter.includes(Object.keys(filterCondition)[i])){
            return res.status(400).send({status:false,msg:'wrong filter condition present'})
        }
    }
   if(Object.keys(filterCondition).includes('userId')){ if(!ObjectId.isValid(filterCondition.userId)) return res.status(400).send({status:false,msg:'userId is not valid'})}
    //  userId validatiion
    filterCondition.isDeleted = false;
    let data = await bookModel.find(filterCondition).collation({locale: "en" }).sort({title:1}).select({title:1,excerpt:1,userId:1,category:1,releasedAt:1,review:1})
    if(data.length == 0) return res.status(404).send({status:false,msg:"no book found"})
    return res.status(200).send({status:true,msg:"success",data:data})
}
// mongoDB gave us a bison type of Object
const getBooksWithId = async function(req,res){
    let bookId = req.params.bookId;
    if(!bookId) return res.status(400).send({status:false,msg:'enter the book id to find'})
    if(!ObjectId.isValid(bookId)) return res.status(400).send({status:false,msg:'bookId is not valid'})
    let data = await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!data) return res.status(400).send({status:false,msg:'book with bookId was not found'})
    let review = await reviewModel.find({bookId:bookId,isDeleted:false})
    data = data.toObject()
    data.reviewsData = review
    //let book = {...data,reviesData:review}
    return res.status(200).send({status:true,msg:"success",data:data})

}
// - title
//   - excerpt
//   - release date
//   - ISBN
const updateBook = async function(req,res){
    let bookId = req.params.bookId;
    if(!bookId) return res.status(400).send({status:false,msg:'enter the book id to find'})
    if(!ObjectId.isValid(bookId)) return res.status(400).send({status:false,msg:'bookId is not valid'})
    let data = await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!data) return res.status(400).send({status:false,msg:'book with bookId was not found'})
    
    let updateDetails = req.body;
    if(Object.keys(updateDetails).includes('title')){
        let dupTitle = await bookModel.findOne({title:updateDetails.title,isDeleted:false})
        if(dupTitle) return res.status(400).send({status:false,msg:`book with ${updateDetails.title} is already present.`})
    }

    if(Object.keys(updateDetails).includes('ISBN')){
        let dupISBN = await bookModel.findOne({ISBN:updateDetails.ISBN,isDeleted:false})
        if(dupISBN) return res.status(400).send({status:false,msg:`book with ${updateDetails.ISBN} is already present.`})
    }
    if(Object.keys(updateDetails).includes('releasedAt')){
        if(!(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(updateDetails.releasedAt))){
            return res.status(400).send({status:false,msg:"released Date is not valid"})
        }
    }
    
    let updatedBook = await bookModel.findOneAndUpdate({_id:bookId,isDeleted:false}, {$set:{title:updateDetails.title, excerpt:updateDetails.excerpt,releasedAt:updateDetails.releasedAt,ISBN:updateDetails.ISBN}},{new:true})
    let review = await reviewModel.find({bookId:bookId,isDeleted:false})
    updatedBook = updatedBook.toObject()
    updatedBook.reviesData = review
    //let book = {...data,reviesData:review}
    return res.status(201).send({status:true,msg:"success",data:updatedBook})
}

const deleteBook = async function(req,res){
    let bookId = req.params.bookId;
    let book = await bookModel.findOne({_id:bookId, isDeleted:false})
    if(!book) return res.status(400).send({status:false,msg:'unable to find book with given bookId'})
    let bookDel = await bookModel.findOneAndUpdate({_id:bookId, isDeleted:false},{isDeleted:true,deletedAt:new Date})
    return res.status(200).send({status:true,msg:'success'})
}

module.exports.createBooks = createBooks
module.exports.getBooks = getBooks
module.exports.getBooksWithId = getBooksWithId
module.exports.updateBook = updateBook
module.exports.deleteBook = deleteBook