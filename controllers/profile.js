const Profile = require("../models/Profile"); 
const User = require("../models/User");
const {validationResult}= require("express-validator");
const request = require("request");

exports.getProfile = async (req,res)=>{
    // console.log(req.user);
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

exports.updateProfile = async (req,res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        });
    }

    const {
        company,website,location,bio,
        status,gitHubUsername,skills,
        facebook,twitter,instagram,linkedin
    } = req.body;

    // console.log(req.body);

    const profileFields={};
        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if(website) profileFields.website = website;
        if(location) profileFields.location = location;
        if(bio) profileFields.bio = bio;
        if(status) profileFields.status = status;
        if(gitHubUsername) profileFields.gitHubUsername = gitHubUsername;

        if(skills){
            profileFields.skills = skills.split(",").map(skill=>skill.trim());
        }

        profileFields.social = {};

        if(twitter) profileFields.social.twitter = twitter;
        if(facebook) profileFields.social.facebook = facebook;
        if(linkedin) profileFields.social.linkedin = linkedin;
        if(instagram) profileFields.social.instagram = instagram;

        // console.log(profileFields.skills);
        try{
            let profile  = await Profile.findOne({user:req.user.id});
            
            if(profile){
                //update
              profile = await  Profile.findOneAndUpdate({user:req.user.id},
                { $set:profileFields },
                {new :true},
              );

              return res.json(profile);
            }

            //create

            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile);
        }
        catch(err){
            console.error(err.message);
            res.status(500).send("Internal Server Error!");
        }

        res.send("profile builder");

}

exports.getAllProfiles = async (req,res)=>{
    try{
        const profiles = await Profile.find().populate(
            'user',['name','avatar']
        );
        return res.json(profiles);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Internal Server Error!");
    }
}

exports.getUserProfile = async(req,res)=>{
    try{
        const profile = await Profile
        .findOne({user:req.params.userId})
        .populate(
            'user',['name','avatar']
        );

        if(!profile)
        return res.status(400).json({
            msg:"Profile Not found!!"
        })
        return res.json(profile);
    }
    catch(err){
        console.error(err.message);
        if(err.kind=='ObjectId'){
            return res.status(500).json({
                msg:"Profile not Found!"
            })
        }
        res.status(500).send("Internal Server Error!");
    }
}

exports.deleteUserDetails = async (req,res)=>{
try{
    await Profile.findOneAndRemove({user:req.user.id});

    await User.findOneAndRemove({_id:req.user.id});

    return res.json({
        msg:"User Deleted Successfully!"
    });
}
catch(err){
    console.error(err.message);
    return res.status(500).send({
        msg:"Internal Server Error!"
    })
}
}

exports.addExperience = async (req,res)=>{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;


        const newExperience = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }


     try{
        const profile = await Profile.findOne({user:req.user.id});
        console.log(newExperience);

        profile.experience.unshift(newExperience);

        await profile.save();

        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send({
            msg:"Internal Server Error!!"
        })
    }
}

exports.deleteExperience = async (req,res)=>{
    try{
        const profile = await Profile.findOne({user:req.user.id});

        const removeIndex = profile.experience
         .map(item => item.id).indexOf(req.params.ExpId);

        profile.experience.splice(removeIndex,1);
        await profile.save();

        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send({
            msg:err.message
        })
    }
}

exports.addEducation = async (req,res)=>{
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            });
        }

        const {
            school,
            degree,
            fieldOfStudy,
            from,
            to,
            current,
            description
        } = req.body;


        const newEducation = {
            school,
            degree,
            fieldOfStudy,
            from,
            to,
            current,
            description
        }


     try{
        const profile = await Profile.findOne({user:req.user.id});
        console.log(newEducation);

        profile.education.unshift(newEducation);

        await profile.save();

        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send({
            msg:"Internal Server Error!!"
        })
    }
}

exports.deleteEducation = async (req,res)=>{
    try{
        const profile = await Profile.findOne({user:req.user.id});

        const removeIndex = profile.education
         .map(item => item.id).indexOf(req.params.EduId);

        profile.education.splice(removeIndex,1);
        await profile.save();

        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send({
            msg:err.message
        })
    }
}

exports.getGithubUser = async (req,res)=>{
    
    try {
        const options = {
            uri:`https://api.github.com/users/${req.params.username}/repos?per_page=7&
            sort=created:asc&client_id=${process.env.githubClientId}&
            client_secret=${process.env.githubClientSecret}`,
            method:"GET",
            headers:{
                "user-agent" :"node.js"
            }
        }

        // console.log(options);

        request(options, (error,response,body)=>{
            if(error)
            console.error(error);

            if(response.statusCode!==200){
                return res.status(404).json({
                    msg:"Github Profile not Found!!"
                });
            }

            res.json(JSON.parse(body));

        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send({
            msg:err.message
        }) 
    }
}