const express = require('express')
const router = express.Router()

const userController = require("../controller/userController")
const bookController = require('../controller/bookController')
const reviewController = require('../controller/reviewController')

// user api
router.post('/register',userController.createUser)
router.post('/loginUser',userController.loginUser)

// book api
router.post('/books', bookController.createBooks)
router.get('/books', bookController.getBooks)
router.get('/books/:bookId',bookController.getBooksWithId)
router.put('/books/:bookId', bookController.updateBook)
router.delete('/books/:bookId',bookController.deleteBook)

// review api
router.post('/books/:bookId/review', reviewController.createReview)
router.put('/books/:bookId/review/:reviewId',reviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReview)



module.exports=router