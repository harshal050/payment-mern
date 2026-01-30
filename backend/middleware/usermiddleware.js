
const jwt = require('jsonwebtoken');
const jwtsecret = process.env.JWTSECRET;

const usermiddleware = async(req,res,next)=>{
    try{
        const token = req.header('authorization');
        const data = jwt.verify(token,jwtsecret);
        req.username = data;
        next();
    }catch(e){
        res.status(500).json({
            message : "Auth error!",
            success : false
        })
    }
}

module.exports = {
    usermiddleware
}