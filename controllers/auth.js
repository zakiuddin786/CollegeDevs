const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator")

const jwt = require("jsonwebtoken");

exports.login=async (req,res)=>{

        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            });
        }
        // console.log(req.body);
        const { email, password }  = req.body;

        try{

            let user = await User.findOne({email});
            if(!user){
               return  res.status(400).json({
                    errors:[{
                        msg:"Invalid Credentials"
                    }]
                })
            }
             
            const isMatch = await bcrypt.compare(password,user.password);

            if(!isMatch){
                return res.status(400).json({
                    errors:[{
                        msg:"Invalid Credentials"
                    }]
                });
            }

            const payload = {
                user:{
                    id:user.id
                }
            };

            jwt.sign(
                payload,
                process.env.JWTSecret,
                { expiresIn:36000 },
                (err,token)=>{
                    if(err)
                   {
                       console.log(err) ;
                       throw err;
                    }
                    console.log(token);
                    res.json({
                        token
                    });
                }
                );
        }
        catch(err){
            console.error(err.message);
           return res.status(500).json({
               "errors":"Server Error"
           })
        }
    }