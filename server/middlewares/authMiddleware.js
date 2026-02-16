const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        // Check if authorization header exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No authorization header provided"
            });
        }

        // Check if header has Bearer format
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization header format. Use: Bearer <token>"
            });
        }

        const token = parts[1];
        
        // Verify token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        
        // Set user object consistently - this matches what your route expects
        req.user = {
            id: decodedToken._id || decodedToken.id || decodedToken.userId,
            ...decodedToken
        };

        // Also keep userId for backward compatibility
        req.userId = req.user.id;

        next();

    } catch(error) {
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired"
            });
        }
        
        // Generic error
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};