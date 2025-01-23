import { Alert, Button, Dropdown, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaCross,
  FaEllipsisV,
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown,
  FaThumbsUp,
  FaTimes,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import moment from "moment";

export default function Comment({ comment, setPostComments }) {
  const { currentUser } = useSelector((state) => state.user);
  const [commentUsers, setCommentUsers] = useState([]);
  const [commentEditing, setCommentEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentText, setCommentText] = useState(comment.content);
  const [isCommentLiked, setIsCommentLiked] = useState(false);
  const [isCommentDisLiked, setIsCommentDisLiked] = useState(false);

  useEffect(() => {
    async function fetchUser(userId) {
      try {
        if (userId) {
          const response = await fetch(`/api/user/get-user/${userId}`);

          const data = await response.json();
          if (response.ok) {
            setCommentUsers((prev) => ({
              ...prev,
              [userId]: data,
            }));
          }
        }
      } catch (error) {
        console.log(error.message);
        throw error;
      }
    }

    fetchUser(comment.userId);
  }, [comment._id]);

  function handleEdit(e) {
    setCommentEditing(true);
    setEditedContent(comment.content);
  }

  async function updateComment(e) {
    e.preventDefault();

    try {
      const response = await fetch(`/api/comment/edit-comment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCommentError(data.message);
      } else {
        setCommentEditing(false);
        setCommentText(editedContent);
      }
    } catch (error) {
      throw error;
    }
  }

  async function deleteComment(e) {
    try {
      const response = await fetch(
        `/api/comment/delete-comment/${comment._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setCommentError(data.message);
      } else {
        setPostComments((prevComments) =>
          prevComments.filter((item) => item._id !== comment._id)
        );
      }
    } catch (error) {
      setCommentError(error.message);
    }
  }

  async function handleLike(e) {
    setIsCommentLiked(!isCommentLiked);

    try {
      if (isCommentDisLiked) {
        setIsCommentDisLiked(false);
      }

      if (!isCommentLiked) {
        const response = await fetch(
          `/api/comment/updateLike/${comment._id}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              likedUsers: [...comment.likedUsers, currentUser._id],
            }),
          }
        );

        console.log(response);

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
          setCommentError(data.message);
        }
      } else {

        const response = await fetch(
          `/api/comment/updateLike/${comment._id}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              likedUsers: comment.likedUsers.filter(user => user !== currentUser._id)
            }),
          }
        );

        console.log(response);

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
          setCommentError(data.message);
        }

      }

    } catch (error) {
      console.log(error.message);
      throw error.message;
    }
  }

  async function handleDisLike(e) {
    if (isCommentLiked) {
      setIsCommentLiked(false);
    }

    setIsCommentDisLiked(!isCommentDisLiked);
  }

  return (
    <div>
      <div className="my-5 px-5 py-2 flex gap-5 items-center justify-between">
        <div className="flex gap-4 items-center">
          <img
            src={
              commentUsers[comment.userId] &&
              commentUsers[comment.userId].profilePicture
            }
            alt="https://imgs.search.brave.com/VtHaXSbqH1ZMOqr9D39V6nWtacRWYqK01jdkMhcQLyY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEwLzI5LzY2LzA1/LzM2MF9GXzEwMjk2/NjA1NzVfRFBkd2tu/RWE3aGlFdmVSdWpz/Qm14WExmRnhKTTMx/VUEuanBn"
            className="object-cover rounded-full h-7 w-7"
          />
          <h2 className="font-semibold text-sm">
            {commentUsers[comment.userId] &&
              commentUsers[comment.userId].username}
          </h2>
          <h2 className="font-light text-xs">
            {moment(comment.createdAt).fromNow()}
          </h2>
        </div>
        <Dropdown
          inline
          arrowIcon={false}
          label={<FaEllipsisV className="text-xs" />}
          className="self-end text-center outline-none cursor-pointer"
        >
          {currentUser._id === comment.userId && (
            <Dropdown.Item
              className="py-0 font-light text-xs text-blue-800"
              onClick={handleEdit}
            >
              Edit
            </Dropdown.Item>
          )}
          <Dropdown.Divider />
          {(currentUser.isAdmin || currentUser._id === comment.userId) && (
            <Dropdown.Item
              className="py-0 font-light text-xs text-red-500"
              onClick={deleteComment}
            >
              Delete
            </Dropdown.Item>
          )}
        </Dropdown>
      </div>
      <div className="px-10 font-light text-sm w-full border-b border-slate-300 pb-4">
        {commentEditing ? (
          <div className="flex flex-col gap-2">
            <Textarea
              className="resize-none p-3"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            ></Textarea>
            <div className="button-group flex gap-5 justify-end">
              <Button className="border-b bg-blue-500" onClick={updateComment}>
                <FaCheck />
              </Button>
              <Button
                className="bg-red-500"
                onClick={() => setCommentEditing(false)}
              >
                <FaTimes />
              </Button>
            </div>
          </div>
        ) : (
          <p className="p-3">{commentText}</p>
        )}
        <div className="py-2 px-3 flex gap-6">
          <span className="flex gap-2">
            {isCommentLiked ? (
              <FaThumbsUp className="cursor-pointer" onClick={handleLike} />
            ) : (
              <FaRegThumbsUp className="cursor-pointer" onClick={handleLike} />
            )}
            <p>{comment.likedUsers.length > 0 && comment.likedUsers.length}</p>
          </span>
          <span onClick={handleDisLike}>
            {isCommentDisLiked ? (
              <FaThumbsDown className="cursor-pointer" />
            ) : (
              <FaRegThumbsDown className="cursor-pointer" />
            )}
          </span>
        </div>
      </div>
      {commentError && <Alert color="failure" content={commentError} />}
    </div>
  );
}
