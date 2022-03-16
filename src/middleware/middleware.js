const jwt = require("jsonwebtoken");


let mid1 = async function (req, res, next) {

    try {
        let token = req.headers["x-api-key"]
        let decodedToken = jwt.verify(token, "secret-key");
        if (!decodedToken) {
            return res.send({ status: false, msg: "token is invalid" });
        } 

        let authorToBeModified = req.query.authorId;
        let authorLoggedIn = decodedToken.authorId;

        if (authorToBeModified != authorLoggedIn)
            return res.status(403).send({ status: false, msg: 'Authentication failed' })
        next();
        
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}


// let mid2 = async function (req, res) {


//    try { let authorToBeModified = req.params.authorId
//     let authorLoggedIn = decodedToken.authorId

//     if (authorToBeModified != authorLoggedIn)
//         return res.status(403).send({ status: false, msg: 'Authentication failed' })

//     next();
//    } catch (err){
//        res.status(500).send({msg:err.message})
//    }

// }



module.exports.mid1 = mid1
//module.exports.mid2 = mid2