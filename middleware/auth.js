const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
    //get token from header
    const token = req.header('x-auth-token');
    // check if not token
    if(!token){
        return res.status(401).json({
            msg:"no token, authorization failed!"
        });
    }
    // verify token
    try{
        const decoded= jwt.verify(token,process.env.JWTSecret);
        req.user = decoded.user;
        next();
    }
    catch(err){
        res.status(401).json({
            msg:"not a valid token"
        });
    }
}