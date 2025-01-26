import { Alert, Button, Textarea } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comments from "./Comments";
import Comment from "./Comment";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [postComments, setPostComments] = useState([]);

  const navigate = useNavigate();

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
  }, [postId, postComments.length]);

  async function handleComment(e) {
    try {
      setComment(e.target.value);
    } catch (error) {
      throw error;
    }
  }

  async function handlePostComment(e) {
    e.preventDefault();

    try {
      if (postId) {
        const response = await fetch(`/api/comment/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: comment,
            postId,
            userId: currentUser._id,
          }),
        });
        const data = await response.json();

        if (response.ok) {
          setCommentError(null);
          setComment("");
          console.log(comment);
          setPostComments((prev) => [...prev, data]);
        } else {
          setCommentError(data.message);
          setComment("");
        }
      } else {
        setCommentError("No post id found.");
      }

      setComment("");
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function handleLike(commentId) {
    
    console.log(commentId);

    try {

      if (!commentId) {
        return;
      }

      const response = await fetch(`/api/comment/updateLike/${commentId}/`, {
        method: "PUT"
      });

      console.log(response);

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        console.log(postComments);
        setPostComments(postComments.map(prevComment => {
          prevComment._id === commentId ? {
            ...prevComment,
            likedUsers: data.likedUsers,
            likeNos: data.likedUsers.length
          }: prevComment
        }));
      }

    } catch (error) {
      throw error.message;
    }
  }

  return (
    <>
      {currentUser ? (
        <div className="">
          <div className="my-3">
            <p className="text-left py-6">
              Logged in as{" "}
              <span className="text-blue-600">@{currentUser.email}</span>
            </p>
            {commentError && <Alert color="failure">{commentError}</Alert>}
          </div>
          <form
            onSubmit={handlePostComment}
            className="comment-box flex flex-col gap-4"
          >
            <Textarea
              className="h-40 resize-none"
              placeholder="Write here ..."
              onChange={handleComment}
              value={comment}
            />
            <Button gradientDuoTone="purpleToBlue" outline type="submit">
              Post comment
            </Button>
          </form>

          <div className="text-2xl border-b border-slate-500 py-4 mt-10 ps-2 flex gap-2">
            <h1>Comments</h1>
            <div className="border border-b border-black px-3 py-1 text-xl">
              <p>{postComments.length}</p>
            </div>
          </div>

          {postComments.map((comment, index) => {
            
            if (comment) {
              return (
                <Comment
                  comment={comment}
                  key={comment._id}
                  setPostComments={setPostComments}
                  onLike={handleLike}
                />
              );
            }
          })}
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
