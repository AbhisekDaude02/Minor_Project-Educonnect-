import API from "../api/axios";

// Create post
export const postFeed = (feedData) => {
    return API.post("/post/createpost", feedData);
};

// Get all posts
export const getAllPost = () => {
  return API.get("/post/getallpost");
};

// Get single post
export const getOnePost = (postId) => {
  return API.get(`/post/getone/${postId}`);
};

// Update post
export const updatePost = (postId, postData) => {
  return API.put(`/post/update/${postId}`, postData);
};

// Delete post
export const deletePost = (postId) => {
  return API.delete(`/post/delete/${postId}`);
};

// Like or unlike post
export const likeUnlikePost = (postId) => {
  return API.post(`/post/like/${postId}/like`);
};

// Add comment
export const addPostComment = (postId, commentData) => {
  return API.post(`/post/comment/${postId}/comment`, commentData);
};

// Delete comment
export const deletePostComment = (postId, commentId) => {
  return API.delete(
    `/post/deletecomment/${postId}/comment/${commentId}`
  );
};

//getownpost

export const getOwnPost = ()=>{
  return API.get("/post/getmypost")
}