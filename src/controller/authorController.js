const AuthorModel = require("../models/authorModel")
const emailValidator = require('express-validator')


const createAuthor = async function (req, res) {
    try {
        let author = req.body
        const { email } = req.body

        const verifyEmail = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(author.email)) ? true : false

        if (!verifyEmail) {
            return res.status(400).send({ msg: "email not valid" })
        } else {
            let authorCreated = await AuthorModel.create(author)
            res.status(200).send({ data: authorCreated })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


module.exports.createAuthor = createAuthor