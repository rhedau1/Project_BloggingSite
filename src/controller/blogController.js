const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");
const { send } = require("express/lib/response")

//CREATEBLOG-
const createBlog = async function (req, res) {
    try {
        let authorId = req.body.authorId
        let data = req.body

        if (!authorId) return res.status(403).send('The request is not valid as the author details are required.')

        let author = await authorModel.findById(authorId)
        if (!author) return res.status(403).send('The request is not valid as no author is present with  given author id')

        let createdBlog = await blogModel.create(data)
        res.status(201).send({ data: createdBlog })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


//LOGINUSER-


const loginAuthor = async function (req, res) {
    let authorEmail = req.body.email;
    let password = req.body.password;

    let author = await authorModel.findOne({ email: authorEmail, password: password });
    if (!author)
        return res.send({ status: false, msg: "username or the password is not correct" });

//sending token with succesfull login- 
    let token = jwt.sign(
        {
            authorId: author._id.toString()
        },
        "secret-key"
    );
    res.setHeader("x-api-key", token);
    res.send({ status: true, data: token });
};



//GETBLOG-

const getblogs = async function (req, res) {

    try {
        if (req.query.category || req.query.authorId || req.query.tags || req.query.subcategory) {
            let obj = {};
            if (req.query.category) {
                obj.category = req.query.category
            }
            if (req.query.authorId) {
                obj.authorId = req.query.authorId;
            }
            if (req.query.tags) {
                obj.tags = req.query.tags
            }
            if (req.query.subcategory) {
                obj.subcategory = req.query.subcategory
            }
            obj.isDeleted = false
            obj.isPublished = true
            let data = await blogModel.find(obj)
            if (data == false) {
                return res.status(404).send({ status: false, msg: "Filter Criteria Did Not Matched" });
            } else {
                res.status(200).send({ status: true, message: "Successfully fetched all blogs", data: data })
            }
        } else {
            return res.status(404).send({ status: false, msg: "Mandatory filter not given" })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

//UPDATEBLOG-

const updateBlog = async function (req, res) {

    try {
        let blogId = req.query.blogId;
        let blog = await blogModel.findById(blogId);

        if (!blog) {
            return res.status(404).send({ status: false, msg: "No such blog exists" });
        }
        let updatedBlog = await blogModel.updateMany({ _id: blogId }, {
            title: req.body.title, body: req.body.body, tags: req.body.tags, isPublished: true,
            publishedAt: Date.now(), subCategory: req.body.subCategory
        }, { new: true })

        res.status(200).send({ status: true, data: updatedBlog });
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

//DELETEBLOG-


const deleteSpecificItem = async function (req, res) {
    try {

        const data = req.query;
        if (Object.keys(data) == 0) return res.status(400).send({ status: false, msg: "No input provided" })
        const deleteBlog = await blogModel.updateOne(data, { isDeleted: true, deletedAt: new Date() }, { new: true })
        if (!deleteBlog) return res.status(404).send({ status: false, msg: "no such blog found" })
        res.status(200).send({ status: true, msg: deleteBlog })
    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}






module.exports.createBlog = createBlog
module.exports.loginAuthor=loginAuthor
module.exports.getblogs = getblogs
module.exports.updateBlog = updateBlog
module.exports.deleteSpecificItem = deleteSpecificItem

