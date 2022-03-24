const mongoose = require('mongoose')

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
        required:[true,'name is required'],
        trim : true

    },
    fullName: {
        type: String,
        required:[true,'fullName is required'],
        trim : true
    },
    logoLink: {
        type: String,
        match: /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        required: [true,'logoLink is required'],
        trim : true

    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })
module.exports = mongoose.model('college', collegeSchema)
