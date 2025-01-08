import { Button, Textarea } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [postComments, setPostComments] = useState([]);

  async function handleComment(e) {
    try {
      setComment(e.target.value);
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {

    async function getPostComments() {

      try {
        const response = await fetch(`/api/comment/get-comments/${postId}`);

        const data = await response.json();

        if (response.ok) {
          setPostComments(data.comments);
        }

      } catch (error) {
        throw error;
      }

    }

    getPostComments();

  }, [postId]);

  async function handlePostComment(e) {

    try {

      if (postId) {

        const response = await fetch(`api/comment/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: comment, postId, userId: currentUser._id })
        });
        const data = await response.json();

        if (response.ok) {
          setCommentError(null);
        } else {
          setCommentError(data.message);
        }

      } else {
        setCommentError("No post id found.")
      }

    } catch (error) {
      throw error;
    }

  }

  return (
    <>
      {currentUser ? (
        <div className="">
          <div className="">
            <p className="text-left py-6">
              Logged in as{" "}
              <span className="text-blue-600">@{currentUser.email}</span>
            </p>
          </div>
          <form onSubmit={ handlePostComment } className="comment-box flex flex-col gap-4">
            <Textarea
              className="h-40 resize-none"
              placeholder="Write here ..."
              onChange={handleComment}
            />
            <Button gradientDuoTone="purpleToBlue" outline>
              Post comment
            </Button>
          </form>
          <h1 className="text-2xl border-b border-slate-500 py-4 mt-10 ps-2">
            Comments
          </h1>
        </div>
      ) : (
        <div className="flex gap-2">
          <p>You must be logged in to comment.</p>
          <Link to="/login" className="text-blue-600">
            Login?
          </Link>
        </div>
      )}



    </>
  );
}
