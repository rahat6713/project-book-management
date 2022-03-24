
const { create } = require("../models/collegeModel")
const collegeModel = require("../models/collegeModel")

const isValid = function (value) {
    if (typeof value == 'undefined' || value === null) return false
    if (typeof value == 'string' && value.trim().length === 0) return false
    return true
}
const fluc = function(name) {
    return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

//=========create college============
const createCollege = async function (req, res) {
    try {
        // validate body request
        let collegeData = req.body
        if (Object.keys(collegeData) == 0 || collegeData == undefined || collegeData == null) {
            return res.status(400).send({ status: false, msg: "college data is required" })
        }
        // validate name

        if (!isValid(collegeData.name)) {
            return res.status(400).send({ status: false, msg: "name of college is required" })

        }
        // validate Fullname

        if (!isValid(collegeData.fullName)) {
            return res.status(400).send({ status: false, msg: "fullName of college is required" })
        }
        // validate link 
        // destructuring use
        if (!isValid(collegeData.logoLink)) {
            return res.status(400).send({ status: false, msg: "logoLink is required" })
        }
        if (!/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/.test(collegeData.logoLink)) {
            return res.status(400).send({ status: false, msg: "please enter valid link" })

        }
        let duplicateData = await collegeModel.findOne({ name: collegeData.name})
        if (duplicateData) {
            return res.status(400).send({ status: false, msg: "college with this name is already present" })
        }
        //finally create a collegeModel

        let collegeCreate = await collegeModel.create(collegeData)
        let firstUpperCase = fluc(collegeCreate.fullName)
        let result = {
            name: collegeCreate.name,
            fullName : firstUpperCase,
            logoLink : collegeCreate.logoLink,
            isDeleted : collegeCreate.isDeleted
        }
        return res.status(201).send({ status: true, data: result })

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports = {
    createCollege: createCollege
}

