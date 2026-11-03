import React, { useContext, useEffect, useRef, useState } from "react";

import { NavLink } from "react-router-dom";

import {
  FiHome,
  FiUsers,
  FiBookOpen,
  FiBriefcase,
  FiMessageCircle,
  FiBell,
  FiUser,
  FiMoreHorizontal,
  FiImage,
  FiSmile,
  FiX,
  FiSend,
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiBookmark,
  FiTrendingUp,
  FiArrowUpRight,
  FiPlus,
  FiAward,
  FiTrash2,
  FiEdit,
} from "react-icons/fi";

import { AuthContext } from "../../context/authContext";

import {
  postFeed,
  getAllPost,
  updatePost,
  deletePost,
  likeUnlikePost,
  addPostComment,
  deletePostComment,
} from "../../services/feedServices";

// ============================================
// TRENDING TOPICS
// ============================================

const trendingTopics = [
  { name: "AI & Machine Learning", posts: "12.5k posts" },
  { name: "Web Development", posts: "10.8k posts" },
  { name: "Career Guidance", posts: "8.7k posts" },
  { name: "Study Tips", posts: "7.3k posts" },
  { name: "DSA Practice", posts: "6.1k posts" },
];

// ============================================
// SIDEBAR LINKS
// ============================================

const sidebarLinks = [
  { name: "Feed", icon: FiHome, path: "/educonnect" },
  { name: "My Community", icon: FiUsers, path: "/community" },
  { name: "Study Materials", icon: FiBookOpen, path: "/studymaterials" },
  { name: "Jobs & Internships", icon: FiBriefcase, path: "/jobs" },
  { name: "Messages", icon: FiMessageCircle, path: "/messages" },
  { name: "Notifications", icon: FiBell, path: "/notifications" },
  { name: "Profile", icon: FiUser, path: "/profile" },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const getResponsePosts = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.post)) return data.post;
  if (Array.isArray(data?.posts)) return data.posts;

  return [];
};

const getUserId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(value._id || value.id || "");
  }

  return String(value);
};

const formatPostTime = (date) => {
  if (!date) return "Recently";

  const postDate = new Date(date);

  if (Number.isNaN(postDate.getTime())) return "Recently";

  const difference = Date.now() - postDate.getTime();

  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days}d ago`;

  return postDate.toLocaleDateString();
};

// ============================================
// MAIN FEED COMPONENT
// ============================================

const Feed = ({ currentUser }) => {
  const { users } = useContext(AuthContext);

  // Logged-in user
  const user = currentUser || users || {};

  const userId = getUserId(user._id || user.id);

  const userName = user.fullName || "User";

  const userAvatar = user.profilepic || "https://i.pravatar.cc/150?img=12";

  // ============================================
  // STATES
  // ============================================

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Create post modal
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");

  // Post actions
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);

  // Comments
  const [openComments, setOpenComments] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [commentLoading, setCommentLoading] = useState(null);

  // Action loading
  const [actionLoading, setActionLoading] = useState(null);

  // References
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const previewUrlRef = useRef(null);

  // ============================================
  // FETCH ALL POSTS
  // ============================================

  const fetchPosts = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const response = await getAllPost();

      const fetchedPosts = getResponsePosts(response);

      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Fetch posts error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load posts. Please try again.",
      );
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPosts();

    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  // ============================================
  // CREATE POST MODAL
  // ============================================

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setContent("");
    setSelectedImage(null);
    setPreview("");

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================================
  // CONTENT CHANGE
  // ============================================

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  // ============================================
  // IMAGE UPLOAD
  // ============================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG and WEBP images are allowed.");

      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB.");

      e.target.value = "";
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const imageUrl = URL.createObjectURL(file);

    previewUrlRef.current = imageUrl;

    setSelectedImage(file);
    setPreview(imageUrl);
  };

  // ============================================
  // REMOVE SELECTED IMAGE
  // ============================================

  const removeImage = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setSelectedImage(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================================
  // CREATE POST
  // ============================================

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!content.trim() && !selectedImage) {
      alert("Please write something or upload an image.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("content", content.trim());

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await postFeed(formData);

      closeModal();

      await fetchPosts(false);
    } catch (error) {
      console.error("Create post error:", error);

      alert(error.response?.data?.message || "Failed to create post.");
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // CHECK POST LIKE
  // ============================================

  const isPostLiked = (post) => {
    return post.likes?.some((like) => getUserId(like) === userId) || false;
  };

  // ============================================
  // CHECK POST OWNER
  // ============================================

  const isPostOwner = (post) => {
    const authorId = getUserId(post.author);

    return authorId === userId;
  };

  // ============================================
  // LIKE / UNLIKE POST
  // ============================================

  const handleLike = async (postId) => {
    try {
      setActionLoading(postId);

      await likeUnlikePost(postId);

      await fetchPosts(false);
    } catch (error) {
      console.error("Like post error:", error);

      alert(error.response?.data?.message || "Unable to like this post.");
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================
  // SAVE POST
  // ============================================

  const handleSave = (postId) => {
    setSavedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId],
    );
  };

  // ============================================
  // EDIT POST
  // ============================================

  const handleEditPost = async (post) => {
    const updatedContent = window.prompt("Edit your post:", post.content || "");

    if (updatedContent === null) return;

    if (!updatedContent.trim()) {
      alert("Post content cannot be empty.");
      return;
    }

    try {
      setActionLoading(post._id);

      await updatePost(post._id, {
        content: updatedContent.trim(),
      });

      await fetchPosts(false);

      setActiveMenu(null);
    } catch (error) {
      console.error("Update post error:", error);

      alert(error.response?.data?.message || "Unable to update post.");
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================
  // DELETE POST
  // ============================================

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(postId);

      await deletePost(postId);

      setPosts((prev) => prev.filter((post) => post._id !== postId));

      setActiveMenu(null);
    } catch (error) {
      console.error("Delete post error:", error);

      alert(error.response?.data?.message || "Unable to delete post.");
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================
  // ADD COMMENT
  // ============================================

  const handleAddComment = async (postId) => {
    const text = commentText[postId]?.trim();

    if (!text) return;

    try {
      setCommentLoading(postId);

      await addPostComment(postId, { text });

      setCommentText((prev) => ({
        ...prev,
        [postId]: "",
      }));

      await fetchPosts(false);
    } catch (error) {
      console.error("Add comment error:", error);

      alert(error.response?.data?.message || "Unable to add comment.");
    } finally {
      setCommentLoading(null);
    }
  };

  // ============================================
  // DELETE COMMENT
  // ============================================

  const handleDeleteComment = async (postId, commentId) => {
    const confirmDelete = window.confirm("Delete this comment?");

    if (!confirmDelete) return;

    try {
      await deletePostComment(postId, commentId);

      await fetchPosts(false);
    } catch (error) {
      console.error("Delete comment error:", error);

      alert(error.response?.data?.message || "Unable to delete comment.");
    }
  };

  // ============================================
  // EMOJI
  // ============================================

  const handleEmoji = () => {
    setContent((prev) => prev + " 😊");

    textareaRef.current?.focus();
  };

  // ============================================
  // SHARE POST
  // ============================================

  const handleShare = async (post) => {
    const shareText = post.content || "Check out this Educonnect post!";

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.author?.fullName || "User"}`,
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          `${shareText}\n${window.location.href}`,
        );

        alert("Post link copied!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Share error:", error);
      }
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="h-[calc(100vh-80px)] w-full overflow-hidden bg-[#f4f6f9] text-slate-800">
      <div
        className="
          mx-auto grid h-full w-full max-w-[1600px]
          grid-cols-1 gap-4 px-3 py-3
          lg:grid-cols-[230px_minmax(0,1fr)]
          xl:grid-cols-[230px_minmax(0,780px)_300px]
          xl:justify-center xl:gap-5 xl:px-5
        "
      >
        {/* ========================================
            LEFT SIDEBAR
        ======================================== */}

        <aside className="hidden h-full min-h-0 lg:block">
          <div className="h-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <p className="px-3 pb-4 pt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>

            <nav className="space-y-2">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    end={link.path === "/educonnect"}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl px-3 py-3 transition-all duration-200 ${
                        isActive
                          ? "bg-emerald-50 font-semibold text-emerald-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                      }`
                    }
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={19} />

                      <span className="text-[13px]">{link.name}</span>
                    </span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* ========================================
            CENTER FEED
        ======================================== */}

        <main
          className="
            feed-scroll h-full min-h-0 min-w-0
            space-y-4 overflow-x-hidden overflow-y-auto pr-1
          "
        >
          {/* CREATE POST BOX */}

          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={userAvatar}
                alt="Profile"
                className="h-11 w-11 shrink-0 rounded-full border border-slate-100 object-cover"
              />

              <button
                onClick={openModal}
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-500 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                What's on your mind, {userName.split(" ")[0]}?
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <button
                onClick={openModal}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <FiImage size={17} className="text-emerald-600" />
                Photo
              </button>

              <button
                onClick={openModal}
                className="flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800"
              >
                <FiPlus size={15} />
                Create Post
              </button>
            </div>
          </section>

          {/* FEED HEADING */}

          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-base font-bold text-slate-800">Your Feed</h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Discover what your community is sharing
              </p>
            </div>

            <button
              onClick={() => fetchPosts()}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 hover:border-emerald-300"
            >
              Latest <FiMoreHorizontal />
            </button>
          </div>

          {/* LOADING */}

          {loading && (
            <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />

              <p className="mt-3 text-sm text-slate-500">
                Loading your feed...
              </p>
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
              <p className="text-sm text-red-600">{error}</p>

              <button
                onClick={() => fetchPosts()}
                className="mt-3 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ========================================
              ALL POSTS
          ======================================== */}

          {!loading &&
            !error &&
            posts.map((post) => {
              const author = typeof post.author === "object" ? post.author : {};

              const isLiked = isPostLiked(post);
              const isSaved = savedPosts.includes(post._id);
              const isOwner = isPostOwner(post);

              return (
                <article
                  key={post._id}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* POST HEADER */}

                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={
                          author.profilepic ||
                          "https://i.pravatar.cc/150?img=12"
                        }
                        alt={author.fullName || "User"}
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-800">
                          {author.fullName || "Educonnect User"}
                        </h3>

                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {author.role || "Member"} ·{" "}
                          {formatPostTime(post.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* POST MENU */}

                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === post._id ? null : post._id,
                          )
                        }
                        className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                      >
                        <FiMoreHorizontal size={19} />
                      </button>

                      {activeMenu === post._id && (
                        <div className="absolute right-0 top-9 z-20 w-40 rounded-lg border border-slate-100 bg-white p-1 shadow-lg">
                          <button
                            onClick={() => {
                              handleSave(post._id);
                              setActiveMenu(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                          >
                            <FiBookmark size={15} />
                            {isSaved ? "Unsave post" : "Save post"}
                          </button>

                          {isOwner && (
                            <>
                              <button
                                onClick={() => handleEditPost(post)}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                              >
                                <FiEdit size={15} />
                                Edit post
                              </button>

                              <button
                                onClick={() => handleDeletePost(post._id)}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                              >
                                <FiTrash2 size={15} />
                                Delete post
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* POST CONTENT */}

                  {post.content && (
                    <div className="px-4 pb-3">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {post.content}
                      </p>
                    </div>
                  )}

                  {/* POST IMAGE */}

                  {post.image && (
                    <div className="mx-3 mb-2 overflow-hidden rounded-xl bg-slate-50">
                      <img
                        src={post.image}
                        alt="Post"
                        className="max-h-[450px] w-full object-contain"
                      />
                    </div>
                  )}

                  {/* POST COUNTS */}

                  <div className="mx-4 flex items-center justify-between border-b border-slate-100 py-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                        <FiHeart size={11} />
                      </span>

                      {post.likes?.length || 0}
                    </span>

                    <span>{post.comments?.length || 0} Comments</span>
                  </div>

                  {/* POST ACTIONS */}

                  <div className="mx-3 flex items-center justify-between py-1">
                    <button
                      disabled={actionLoading === post._id}
                      onClick={() => handleLike(post._id)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition hover:bg-slate-50 disabled:opacity-50 ${
                        isLiked ? "text-blue-600" : "text-slate-500"
                      }`}
                    >
                      <FiHeart
                        size={17}
                        fill={isLiked ? "currentColor" : "none"}
                      />

                      {isLiked ? "Liked" : "Like"}
                    </button>

                    <button
                      onClick={() =>
                        setOpenComments(
                          openComments === post._id ? null : post._id,
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                    >
                      <FiMessageSquare size={17} />
                      Comment
                    </button>

                    <button
                      onClick={() => handleShare(post)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                    >
                      <FiShare2 size={17} />
                      Share
                    </button>

                    <button
                      onClick={() => handleSave(post._id)}
                      className={`rounded-lg p-2 hover:bg-slate-50 ${
                        isSaved ? "text-emerald-700" : "text-slate-500"
                      }`}
                      title="Bookmark post"
                    >
                      <FiBookmark size={17} />
                    </button>
                  </div>

                  {/* ========================================
                      COMMENTS SECTION
                  ======================================== */}

                  {openComments === post._id && (
                    <div className="border-t border-slate-100 p-4">
                      {/* COMMENT INPUT */}

                      <div className="mb-4 flex gap-2">
                        <img
                          src={userAvatar}
                          alt="Profile"
                          className="h-9 w-9 rounded-full object-cover"
                        />

                        <input
                          type="text"
                          value={commentText[post._id] || ""}
                          onChange={(e) =>
                            setCommentText((prev) => ({
                              ...prev,
                              [post._id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddComment(post._id);
                            }
                          }}
                          placeholder="Write a comment..."
                          className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs outline-none focus:border-emerald-500"
                        />

                        <button
                          disabled={
                            commentLoading === post._id ||
                            !commentText[post._id]?.trim()
                          }
                          onClick={() => handleAddComment(post._id)}
                          className="rounded-full bg-emerald-700 p-2 text-white hover:bg-emerald-800 disabled:opacity-50"
                        >
                          <FiSend size={15} />
                        </button>
                      </div>

                      {/* EXISTING COMMENTS */}

                      <div className="space-y-4">
                        {post.comments?.map((comment) => {
                          const commentUser =
                            typeof comment.user === "object"
                              ? comment.user
                              : {};

                          const isCommentOwner =
                            getUserId(comment.user) === userId;

                          return (
                            <div
                              key={comment._id}
                              className="flex items-start gap-2"
                            >
                              <img
                                src={
                                  commentUser.profilepic ||
                                  "https://i.pravatar.cc/150?img=12"
                                }
                                alt={commentUser.fullName || "User"}
                                className="h-8 w-8 rounded-full object-cover"
                              />

                              <div className="min-w-0 flex-1 rounded-xl bg-slate-50 p-3">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-xs font-bold text-slate-800">
                                    {commentUser.fullName || "User"}
                                  </p>

                                  {isCommentOwner && (
                                    <button
                                      onClick={() =>
                                        handleDeleteComment(
                                          post._id,
                                          comment._id,
                                        )
                                      }
                                      className="text-slate-400 hover:text-red-600"
                                      title="Delete comment"
                                    >
                                      <FiTrash2 size={14} />
                                    </button>
                                  )}
                                </div>

                                <p className="mt-1 break-words text-xs leading-5 text-slate-600">
                                  {comment.text}
                                </p>
                              </div>
                            </div>
                          );
                        })}

                        {(!post.comments || post.comments.length === 0) && (
                          <p className="py-3 text-center text-xs text-slate-400">
                            No comments yet. Start the conversation!
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}

          {/* EMPTY FEED */}

          {!loading && !error && posts.length === 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center">
              <FiUsers className="mx-auto text-4xl text-slate-300" />

              <h3 className="mt-3 text-sm font-bold text-slate-700">
                Your feed is empty
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Start sharing something with your community.
              </p>

              <button
                onClick={openModal}
                className="mt-4 rounded-lg bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white"
              >
                Create your first post
              </button>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="py-4 text-center text-xs text-slate-400">
              You're all caught up! 🎉
            </div>
          )}
        </main>

        {/* ========================================
            RIGHT SIDEBAR
        ======================================== */}

        <aside className="hidden h-full min-h-0 overflow-hidden xl:block">
          <div className="flex h-full flex-col gap-4">
            {/* PROMOTION CARD */}

            <div className="relative shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-5 text-white shadow-sm">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-[22px] border-white/5" />

              <FiAward className="relative mb-3 text-3xl text-yellow-300" />

              <h2 className="relative text-lg font-bold leading-6">
                Keep Learning,
                <br />
                Keep Growing!
              </h2>

              <p className="relative mt-2 text-xs leading-5 text-emerald-50">
                Be the best version of yourself with Educonnect.
              </p>

              <NavLink
                to="/studymaterials"
                className="relative mt-4 flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
              >
                Explore Resources <FiArrowUpRight />
              </NavLink>
            </div>

            {/* TRENDING TOPICS */}

            <section className="shrink-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <FiTrendingUp className="text-orange-500" />
                  Trending Topics
                </h3>

                <button className="text-xs font-semibold text-emerald-700">
                  See all
                </button>
              </div>

              <div className="space-y-4">
                {trendingTopics.map((topic, index) => (
                  <div key={topic.name} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-xs font-bold text-slate-600">
                      {index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-800">
                        {topic.name}
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {topic.posts}
                      </p>
                    </div>

                    <FiArrowUpRight
                      size={16}
                      className="shrink-0 text-emerald-600"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </aside>
      </div>

      {/* ========================================
          CREATE POST MODAL
      ======================================== */}

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 px-3 py-5 backdrop-blur-[3px]"
          onClick={closeModal}
        >
          <div
            className="my-auto w-full max-w-[680px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <FiPlus size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Create Post
                  </h2>

                  <p className="text-xs text-slate-500">
                    Share something with your community
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                disabled={submitting}
                className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-red-50 hover:text-red-600"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePost}>
              <div className="p-5">
                {/* USER */}

                <div className="mb-4 flex items-center gap-3">
                  <img
                    src={userAvatar}
                    alt="Profile"
                    className="h-11 w-11 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      {userName}
                    </h3>

                    <span className="mt-1 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Public
                    </span>
                  </div>
                </div>

                {/* CAPTION */}

                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleChange}
                    maxLength={500}
                    placeholder="Share something with your network..."
                    className="min-h-[125px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-4 pb-8 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />

                  <span className="absolute bottom-3 right-4 text-[11px] text-slate-400">
                    {content.length}/500
                  </span>
                </div>

                {/* IMAGE PREVIEW */}

                {preview && (
                  <div className="relative mt-4 overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={preview}
                      alt="Selected preview"
                      className="max-h-[250px] w-full bg-slate-50 object-contain"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-3 top-3 rounded-full bg-slate-900/75 p-2 text-white hover:bg-red-600"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}

                {/* IMAGE UPLOAD */}

                {!preview && (
                  <label
                    htmlFor="post-image"
                    className="mt-4 flex min-h-[130px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-5 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40"
                  >
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <FiImage size={22} />
                    </div>

                    <h3 className="text-sm font-bold text-emerald-800">
                      Upload Image
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Click to browse or drag your image here
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      JPG, PNG, WEBP · Maximum 10MB
                    </p>
                  </label>
                )}

                <input
                  ref={fileInputRef}
                  id="post-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* MODAL TOOLS */}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
                    >
                      <FiImage className="text-emerald-600" size={16} />
                      Add Photo
                    </button>

                    <button
                      type="button"
                      onClick={handleEmoji}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
                    >
                      <FiSmile className="text-amber-500" size={16} />
                      Emoji
                    </button>
                  </div>

                  {selectedImage && (
                    <span className="max-w-[150px] truncate text-[11px] text-emerald-700">
                      {selectedImage.name}
                    </span>
                  )}
                </div>
              </div>

              {/* MODAL FOOTER */}

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-lg bg-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-300 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting || (!content.trim() && !selectedImage)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiSend size={15} />

                  {submitting ? "Publishing..." : "Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================
          SCROLLBAR STYLING
      ======================================== */}

      <style>{`
        .feed-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .feed-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .feed-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .feed-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 20px;
        }

        .feed-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Feed;
