const User = require("../models/usersModel");
const Post = require("../models/postModel");
const { post } = require("../routes/connectionRoutes");

// Making the controller for post 

const createPost = async (req,res)=>{
    try {
        const userId = req.user.userId;

        const{content}= req.body;
        if(!content || content.trim()===""){
            return res.status(400).json({
                message:"Content is needed"
            })
        }

        const post = await Post.create({
            author:userId,
            content:content.trim()
        })


        const populatedPost = await Post.findById(post._id).populate("author","fullName,email,role,profilepic");

        res.status(200).json({
            message:"Post created successfully",
            post:populatedPost,
        })

    } catch (error) {
        console.log("Error in the post Creation ",error.message);
        res.status(500).json({
            message:"Failed to create the post ",
            errro:error.message
        });
        
    }
}


//Making the controller to get all the post 
const getAllPost = async(req,res)=>{
    try {
        const post = await Post.find()
        .populate("author","fullName email role profilepic")
        .populate("comments.user","fullName profilepic").sort({createdAt:-1});

        if(!post){
            return res.status(200).json({
                message:"Post not Found",
            });
        }

        res.status(200).json({
            message:"All the post are fetch successfully",
            post
        })
    } catch (error) {
        console.log("Error in the fetching Post",error.message);

        res.status(500).json({
            message:"Failed to fetch the post"
        })
        
    }
};

//Making the controller to get the one post 

const getOnePost = async (req,res)=>{
    try {
        const postId = req.params.postId;
        const onePost = await Post.findById(postId)
        .populate("author","fullName email role profilepic")
        .populate("comments.user","fullName,profilepic");

        if(!onePost){
            return res.status(400).json({
                message:"Post not found",
            });
        }
        res.status(200).json({
            message:"Post fetch successfully",
            onePost
        })
    } catch (error) {
        console.log("Error in finding the one post");
        res.status(500).json({
            message:"Failed to get the one post",
            error:error.message
        })
        
    }
};

//Making the controller to update the content

const updatePost = async(req,res)=>{
    try {
        const userId = req.user.userId;
        const postId = req.params.postId;

        const {content} = req.body;

        if(!content || content.trim()===""){
            res.status(400).json({
                message:"Content is required"
            })
        }
     const post = await Post.findById(postId);

     if(!post){
        res.status(400).json({
            message:"post not fount"
        })
     }

     if(post.author.toString()!==userId.toString()){
        res.status(400).json({
            message:"You are not allowed to update the post"
        })
     }

     post.content = content.trim();
     await post.save();

     const updatedPost = await Post.findById(post._id)
     .populate("author","fullName email role profilepic")
     .populate("comments.user","fullName profilepic");

     res.status(200).json({
        message:"post updated successfully",
        post:updatedPost
     })
    } catch (error) {
        console.log("Error in updatepost");
        res.status(500).json({
            message:"Failed to update the post",
            error:error.message
        })
        
    }
};

//Making the controller for delete the post

const deletePost = async(req,res)=>{
    try {
        const userId= req.user.userId;
        const postId= req.params.postId;
        
        const post = await Post.findById(postId);

        if(!post){
           return res.status(400).json({
                messgae:"Post not found to delete"
            })
        };

        if(post.author.toString()!==userId.toString()){
          return  res.status(400).json({
                message:"You are not allowed to delete the post it only allowed by the author"
            })
        };
       await post.deleteOne();

       res.status(200).json({
        message:"Post deleted successfully"
       })
    } catch (error) {
        console.log("Error in deleting post");
        res.status(500).json({
            message:"Failed to delet the post ",
            error:error.message
        })
        
    }
};

// making the controller for the likeunlike
const likeUnlike = async(req,res)=>{
    try {
        const userId = req.user.userId;
        const postId = req.params.postId;

        const post = await Post.findById(postId);
        if(!post){
            return res.status(400).json({
                message:"post not found"
            })
        }

        const alreadyliked = post.likes.some((id)=>id.toString() === userId.toString());
        
        //to remove the user which are alredy like and make it unlike
        if(alreadyliked){
            post.likes = post.likes.filter((id)=>id.toString()!==userId.toString());
        

        await post.save();

       return  res.status(200).json({
            message:"Like is succesfully unlike",
            liked:false
        });
         }

         post.likes.push(userId);
        await post.save();
       return res.status(200).json({
            message:"Post liked successfully",
            liked:true,
            post
        })
    } catch (error) {
        console.log("Error in thr liking system");
        res.status(500).json({
            message:"Failed the liking system"
        })
        
    }
}

//Making the comment system 

const addComment = async(req,res)=>{
    try {
        const userId = req.user.userId;
        const postId = req.params.postId;

        const {text}= req.body;

        if(!text || text.trim()===""){
            res.status(400).json({
                message:"text cannot be empty"
            })
        }

        const post = await Post.findById(postId);

        if(!post){
            return res.status(400).json({
                message:"Post not found"
            })
        };

        post.comments.push({
            user:userId,
            text:text.trim()
        });

        await post.save();

        const updatePost = await Post.findById(postId)
        .populate("author","fullName email role profilepic")
        .populate("comments.user","fullName profilepic");

        res.status(200).json({
            message:"Comment successfully",
            post:updatePost
        })
    } catch (error) {
        console.log("Add comment error:", error); 
        res.status(500).json({ 
            message: "Failed to add comment", 
            error: error.message
        
    })
}
};

//Making the controller for deleting the comments

const deleteComment = async(req,res)=>{
    try {
        const userId = req.user.userId;
        const postId = req.params.postId;
        const commentId = req.params.commentId;

        const post = await Post.findById(postId);
        if(!post){
            return res.status(400).json({
                message:"Post not found"
            })
        };

        const comment = post.comments.id(commentId)
        if(!comment){
            return res.status(400).json({
                message:"Comment not found"
            })
        }
         if(comment.user.toString()!==userId.toString()){

             return res.status(400).json({
                message:"You are not allowed delete post"
             })
         }

         comment.deleteOne();
         await post.save();

         res.status(200).json({
            message:"Comment deleted successfully"
         })

    } catch (error) {
         console.log("Delete comment error:", error); 
        res.status(500).json({ 
            message: "Failed to Delete comment", 
            error: error.message
        
    })
    }
}
module.exports = {createPost,getAllPost,getOnePost,updatePost,deletePost,likeUnlike,addComment,deleteComment}