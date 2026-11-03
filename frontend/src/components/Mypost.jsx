import React, { useContext, useEffect, useState } from "react";
import {
  FiFilter,
  FiHeart,
  FiMessageCircle,
  FiMoreHorizontal,
  FiPlus,
  FiShare2,
} from "react-icons/fi";

import { getOwnPost } from "../services/feedServices";
import { FeedContext } from "../context/feedContext";

const Mypost = () => {
  const { myFeed, setMyFeed } = useContext(FeedContext);
  const [loading, setLoading] = useState(true);

  const fetchOwnPost = async () => {
    try {
        const res = await getOwnPost();

        console.log("Fetched posts:", res.data.posts);

        setMyFeed(res.data.posts || []);

    } catch (error) {
        console.log(
            "Error fetching posts:",
            error.response?.data || error.message
        );
    } finally {
        setLoading(false);
    }
};
  useEffect(() => {
    fetchOwnPost();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">Loading your posts...</p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">My Posts</h2>
          <p className="mt-1 text-xs text-slate-500">
            All posts you have shared with the community
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800">
          <FiPlus />
          Create Post
        </button>
      </div>

      {/* Post count */}
      <div className="mb-5 flex items-center justify-between text-xs text-slate-500">
        <span>Showing {myFeed.length} posts</span>

        <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
          <FiFilter />
          Latest First
        </button>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {myFeed.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <FiPlus size={22} />
            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              No posts yet
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Your posts will appear here when you share something.
            </p>
          </div>
        ) : (
          myFeed.map((post) => (
            <article
              key={post._id}
              className="rounded-xl border border-slate-100 p-4 transition hover:shadow-sm"
            >
              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      post.author?.profilepic ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.fullName || "User")}`
                    }
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {post.author?.fullName || "Unknown User"}
                    </h3>

                    <p className="text-xs text-slate-400">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>

                <button className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
                  <FiMoreHorizontal />
                </button>
              </div>

              {/* Content */}
              {post.content && (
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {post.content}
                </p>
              )}

              {/* Post image */}
              {post.image && (
                <div className="mt-4 overflow-hidden rounded-xl">
                  <img
                    src={post.image}
                    alt="Post"
                    className="max-h-[450px] w-full object-cover"
                  />
                </div>
              )}

              {/* Engagement */}
              <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <FiHeart className="text-rose-500" />
                  {post.likes?.length || 0} Likes
                </span>

                <span className="flex items-center gap-1.5">
                  <FiMessageCircle className="text-slate-500" />
                  {post.comments?.length || 0} Comments
                </span>

                <span className="flex items-center gap-1.5">
                  <FiShare2 />
                  {post.shares?.length || 0} Shares
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default Mypost;
