const jwt = require('jsonwebtoken');


const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader) {
        return res.status(401).json({ status: "Fail", data: { msg: "Token Required" } });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: "Fail", data: { msg: "Token is missing" } });

    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decodedToken
        next();
    } catch (err) {
        return res.status(403).json({ status: "Fail", data: { msg: "Token Expired " } });

    }
};

module.exports = verifyToken;