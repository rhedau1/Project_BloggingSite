const express= require("express")
const jwt = require("jsonwebtoken");
const router = express.Router()
const AuthorController=require ("../controller/authorController")
const BlogController=require ("../controller/blogController")
const Middleware=require("../middleware/middleware")







router.post ("/authors",AuthorController.createAuthor)
router.post("/authorLogin",BlogController.loginAuthor)
router.post ("/blog",Middleware.mid1,BlogController.createBlog)
router.get("/getBlogsData", Middleware.mid1, BlogController.getblogs)
router.put("/updateBlogsData",Middleware.mid1, BlogController.updateBlog)
router.delete("/deleteBlog",Middleware.mid1, BlogController.deleteSpecificItem)


//router.delete("/deleteBlog",BlogController.deleteUser)


module.exports=router;