const asyncHandler = require("express-async-handler")
const mongoose = require("mongoose");
const Post = require("../models/post");


//@desc Create a post
//@route POST api/post/create
//@access private #isNGO
const createPost = asyncHandler( async (req, res) => {
    const { title, content } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if( req.user.role !== "ngo"){
        res.status(403);
        throw new Error("You are not authorized to create a post");
    }

    const name = req.user.name;
    if (!name){
        res.status(404);
        throw new Error("NGO not found");
    }

    if ( !title || !content){
        res.status(400);
        throw new Error("Fields are mandatory");
    } 

    const post = await Post.create({
        title,
        content,
        imagePath,
        ngo_id: req.user.id,
        NGOname: name,
        deletedAt: null,
    });
    console.log(post);

    if (post){
        console.log("Post Created")
        res.status(201).json({_id: post.id, title: post.title});
    }
    else{
        res.status(400);
        throw new Error("Posting unsuccessful");
    }
});

//@desc Get all post
//@route GET api/post/all-posts
//@access public
const allPosts = asyncHandler( async (req, res) => {
    const posts = await Post.find({deletedAt: null});
    res.json(posts);
});

//@desc Delete post
//@route PATCH api/post/delete
//@access private #isNGO #isAuthor
const deletePost = asyncHandler( async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        console.log(post);
        if(!post){
            res.status(404);
            throw new Error("Post not Found");
        }
        if (req.user.id != post.ngo_id){
            res.status(403);
            throw new Error("User not allowed to delete.");
        }
        post.deletedAt = new Date();
        await post.save();
        res.status(500).json({message: "Post Deleted", post})
    } catch (error){
        res.status(400);
        throw new Error("An error occured, please try again!");
    }
});

module.exports = { createPost, allPosts, deletePost };
