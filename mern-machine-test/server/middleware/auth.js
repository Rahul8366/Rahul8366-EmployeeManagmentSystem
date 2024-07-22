const jwt = require('jsonwebtoken');
const config = require('../config/default.json');

module.exports = function(req, res, next) {
    // Extract token from Authorization header
    const token = req.header('Authorization') && req.header('Authorization').startsWith('Bearer ')
        ? req.header('Authorization').substring(7)
        : null;

    // If no token, respond with an error
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded.user; // Attach user info to request
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
