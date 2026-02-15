const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    try{
        const authHeader = req.headers.authorization;

        const token = authHeader.split(' ')[1];

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        // req.userId = decodedToken._id  || decodedToken.id || decodedToken.userId;

        // next();

       // Set user object consistently - this matches what your route expects
        req.user = {
            id: decodedToken._id || decodedToken.id || decodedToken.userId,
            ...decodedToken
        };

        // Also keep userId for backward compatibility if needed
        req.userId = req.user.id;

        next();

    }catch(error){
        res.send({
            message: error.message,
            success: false
        })
    }
}