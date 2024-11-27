const jwt = require('jsonwebtoken');


module.exports = (playLoad)=>{
    return jwt.sign(playLoad, process.env.JWT_SECRET_KEY, {expiresIn: '5m'})
}