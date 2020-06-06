const Profile = require("../models/Profile"); 
const User = require("../models/User");

exports.getProfile = async (req,res)=>{
    console.log(req.user);
    try{
        const profile = await Profile.findOne({
            user:req.user.id
        }).populate('user',['name','avatar']);

        if(!profile){
            return res.status(400).json({
                msg:"No profile found for this user!"
            });
        }
        res.json(profile);
        }
    catch(err){
        console.error(err.message);
        res.status(500).send("Internal Server Error!");
    }
}