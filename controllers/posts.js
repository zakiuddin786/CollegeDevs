const { validationResult } = require("express-validator");

const Post = require("../models/Post");
const User = require("../models/User");
const Profile = require("../models/Profile");

exports.addPost = async (req,res)=>{
    const errors= validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            });
        }

    try {
        const user = await User.findById(req.user.id).select("-password");

        const newPost = new Post({
            text : req.body.text,
            name: user.name,
            avatar:user.avatar,
            user:req.user.id
        })

        const post = await newPost.save();
        return res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send({
            msg:"Internal Server Error!"
        })
    }
}

exports.getAllPosts = async (req,res)=>{
    try {
        const posts = await Post.find().sort({ date:-1 });
        if(!posts){
            return res.status(404).json({
                msg:"Posts not found!"
            })
        }
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({
            msg:"Internal Server Error!"
        })
     }
        
}

exports.getPost = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.postId);
        if(!post){
            return res.status(404).json({
                msg:"Post not found!"
            });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if(err.kind==='ObjectId'){
            return res.status(404).json({
                msg:"Post Not found!"
            });
        }
        res.status(500).send({
            msg:"Internal Server Error!"
    })
 }
}

exports.deletePost = async (req,res)=>{
    try {
        const post = await Post.findById(req.params.postId);
        // check user Authentication
        if(post.user.toString() !==req.user.id){
            return res.status(401).json({
                msg:"Unauthorized access!!"
            });
        }
        await post.remove();
        res.json({
            ms:"Post deleted successfully!"
        })
    } catch (err) {
        console.error(err.message);
        if(err.kind==='ObjectId'){
            return res.status(404).json({
                msg:"Post Not found!"
            });
        }
            res.status(500).send({
                msg:"Internal Server Error!"
        })
    }
}