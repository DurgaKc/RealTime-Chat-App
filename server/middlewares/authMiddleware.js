const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    try{
        const authHeader = req.headers.authorization;

        const token = authHeader.split(' ')[1];

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        req.userId = decodedToken._id  || decodedToken.id || decodedToken.userId;

        next();
    }catch(error){
        res.send({
            message: error.message,
            success: false
        })
    }
}