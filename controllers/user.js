const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator")

const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.createUser=async (req,res)=>{
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            });
        }
        // console.log(req.body);
        const { name, email, password }  = req.body;

        try{

            let user = await User.findOne({email});
            if(user){
               return  res.status(400).json({
                    errors:[{
                        msg:"User Already exists!"
                    }]
                })
            }

            const avatar = gravatar.url(email,{
                s:"200",
                r:"user",
                d:"mm"
            })

            user = new User({
                name,
                email,
                avatar,
                password
            });

            const salt = await bcrypt.genSalt(11);

            user.password = await bcrypt.hash(password,salt);

            await user.save();

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