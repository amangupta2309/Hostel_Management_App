const Admin = require("../models/schema.js").AdminInfo;
const jwt = require('jsonwebtoken')

 const login = async (req,res)=>{
    try{
        const {username,password} = req.body;

        const admin = await Admin.findOne({user:username});
        if(!admin){
            return res.status(400).json({msg:"Admin not found"})
        }
        const isMatch = (admin.password== password) ? true : false;
        if(!isMatch) {
          
            return res.status(400).json({msg:"Admin not found"})
            

        }
        const token = jwt.sign({ id:admin._id}, process.env.JWT_SECRET);
       
        delete admin.password;

        res.cookie("token",token, {
            maxAge: 3600 * 1000, // 1 hour in milliseconds
            httpOnly: true,
            sameSite: "strict"
          });
        res.redirect('/admin');
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}
module.exports = login;