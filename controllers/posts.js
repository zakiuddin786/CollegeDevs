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
        
        if(!post){
            return res.status(404).json({
                msg:"Post not found!"
            });
        }

        if(post.user.toString() !==req.user.id){
            return res.status(401).json({
                msg:"Unauthorized access!!"
            });
        
        }

        await post.remove();

        res.json({
            msg:"Post deleted successfully!"
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

exports.likePost = async (req,res)=>{
    try {
        const post = await Post.findById(req.params.postId);
        
        //check already liked

        if(post.likes.filter(like =>
            like.user.toString()===req.user.id).length>0){
                return res.status(400).json({
                    msg:"Post Already liked!!"
                });
        }

        post.likes.unshift({
            user:req.user.id
        });

        await post.save();
        return res.json(post.likes);
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

exports.unLikePost = async (req,res)=>{
    try {
        const post = await Post.findById(req.params.postId);
        
        //check already liked

        if(post.likes.filter(like =>
            like.user.toString()===req.user.id).length === 0){
                return res.status(400).json({
                    msg:"Post has not been liked yet!!"
                });
        }

        const removeIndex= post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex,1);

        await post.save();
        return res.json(post.likes);
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

exports.addComment = async (req,res)=>{
    const errors= validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            });
        }

    try {
        const user = await User.findById(req.user.id).select("-password");

        const post = await Post.findById(req.params.postId);

        const newComment = {
            text : req.body.text,
            name: user.name,
            avatar:user.avatar,
            user:req.user.id
        }

        // console.log(newComment);

        post.comments.unshift(newComment);

        await post.save();

        return res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({
            msg:"Internal Server Error!"
        })
    }
}

exports.deleteComment = async (req,res)=>{
    try {
        const post = await Post.findById(req.params.postId);
        
        if(!post){
            return res.status(404).json({
                msg:"Post not found!"
            });
        }

        // find out comment

        const comment = post.comments.find(comment=> comment.id===req.params.commentId);
        console.log(comment);

        if(!comment){
            return res.status(404).json({
                msg:"Comment doesn't exists!"
            });
        }

        //check authorization

        if(comment.user.toString()!==req.user.id){
            return res.status(401).json({
                msg:"Unauthorized Access!!"
            });
        }

        const removeIndex= post.comments
        .map(comment => comment.id.toString()).indexOf(req.user.commentId);

        console.log(removeIndex);

        post.comments.splice(removeIndex,1);

        await post.save();

        res.json({
            msg:"Comment deleted successfully!"
        })
    } catch (err) {
        console.error(err.message);
        if(err.kind==='ObjectId'){
            return res.status(404).json({
                msg:"Comment Not found!"
            });
        }
            res.status(500).send({
                msg:"Internal Server Error!"
        })
    }
}