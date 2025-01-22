import React, { useEffect, useState } from "react";
import {
  FaComment,
  FaEllipsisV,
  FaRegBookmark,
  FaRegComment,
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Post({ post }) {
  const [author, setAuthor] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    async function getPostAuthor() {
      try {
        const response = await fetch(`/api/user/get-user/${post.userId}`);

        const data = await response.json();

        if (response.ok) {
          setAuthor(data);
        }
      } catch (error) {
        throw error;
      }
    }

    getPostAuthor();
  }, [post.userId]);

  return (
    <div className="max-w-[700px] mx-auto my-20 border-b border-slate-500 pb-10">
      <div className="post-header flex items-center mb-6 py-3 justify-between">
        <div className="post-author flex gap-3 items-center justify-start w-20">
          <img
            src={author && author.profilePicture}
            alt={author && author.username}
            className="w-10 h-10 rounded-full"
          />
          <h2 className="text-sm font-semibold">{author.username}</h2>
        </div>

        {currentUser && currentUser._id === post.userId && (
          <FaEllipsisV className="font-light text-sm cursor-pointer self-end" />
        )}
      </div>

      <div className="post-image">
        <Link to={`/post/${post.slug}`}>
          <img
            src={post.image}
            alt={post.title}
            className="object-cover max-w-[700px] rounded-lg cursor-pointer"
          />
        </Link>
      </div>

      <Link to={`/post/${post.slug}`}>
      <h2 className="p-2 pt-4 text-sm font-light">
        {post.title}
      </h2>
      </Link>

      <div className="user-action-group flex gap-5 px-2 py-4">
        <FaRegThumbsUp className="cursor-pointer" />
        <FaRegThumbsDown className="cursor-pointer" />
        <FaRegComment className="cursor-pointer" />
        <FaRegBookmark className="cursor-pointer" />
      </div>
    </div>
  );
}
