const jwt = require('jsonwebtoken')

 const verifyToken = async (req,res,next)=>{
           try{
            const token = req.cookies.token;
                if(!token){
                return res.status(403).redirect('/auth/login');
            }
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.admin = verified;
            if(!verified)
            return res.status(401).send('Access Denied');
            else
            next();
           }
           catch(err){
            res.status(500).json({error: err.message});
           }
}
module.exports = verifyToken;