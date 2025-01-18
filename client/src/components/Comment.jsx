import { Button, Dropdown, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FaCheck, FaCross, FaEllipsisV, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Comment({ comment, index }) {
  const { currentUser } = useSelector((state) => state.user);
  const [commentUsers, setCommentUsers] = useState([]);
  const [commentEditing, setCommentEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    async function fetchUser(userId) {
      try {
        if (userId) {
          const response = await fetch(`/api/user/get-user/${userId}`);

          const data = await response.json();
          if (response.ok) {
            setCommentUsers((prev) => [...prev, data]);
          }
        }
      } catch (error) {
        throw error;
      }
    }

    fetchUser(comment.userId);
  }, []);

  function handleEdit(e) {
    setCommentEditing(true);
    setEditedContent(comment.content);
  }

  async function updateComment(e) {

    e.preventDefault();

    try {

      const response = await fetch(`/api/comment/edit-comment/${comment._id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: editedContent })
      })

    } catch (error) {
      throw error;
    }

  }

  return (
    <div>
      <div className="my-5 px-5 py-2 flex gap-5 items-center justify-between">
        <div className="flex gap-4 items-center">
          <img
            src={commentUsers[index] && commentUsers[index].profilePicture}
            alt="https://imgs.search.brave.com/VtHaXSbqH1ZMOqr9D39V6nWtacRWYqK01jdkMhcQLyY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEwLzI5LzY2LzA1/LzM2MF9GXzEwMjk2/NjA1NzVfRFBkd2tu/RWE3aGlFdmVSdWpz/Qm14WExmRnhKTTMx/VUEuanBn"
            className="object-cover rounded-full h-7 w-7"
          />
          <h2 className="font-semibold text-sm">
            {commentUsers[index] && commentUsers[index].username}
          </h2>
        </div>
        <div className="hidden gap-2 font-light text-xs sm:flex">
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
          <span>{new Date(comment.createdAt).toLocaleTimeString()}</span>
        </div>
        <div className="sm:hidden font-light text-xs">
          <span>
            {/* {getDateTimeDiff(
          new Date(comment.createdAt).toLocaleDateString()
        )} */}
          </span>
        </div>
        <Dropdown
          inline
          arrowIcon={false}
          label={<FaEllipsisV className="text-xs" />}
          className="self-end text-center outline-none cursor-pointer"
        >
          {currentUser._id === comment.userId && (
            <Dropdown.Item className="py-0 font-light text-xs text-blue-800" onClick={handleEdit}>
              Edit
            </Dropdown.Item>
          )}
          <Dropdown.Divider />
          {(currentUser.isAdmin || currentUser._id === comment.userId) && (
            <Dropdown.Item className="py-0 font-light text-xs text-red-500">
              Delete
            </Dropdown.Item>
          )}
        </Dropdown>
      </div>
      <div className="px-10 font-light text-sm w-full border-b border-slate-300 pb-4">
        {
          commentEditing ? <div className="flex flex-col gap-2">
          <Textarea className="resize-none p-3">
            { editedContent }
          </Textarea>
          <div className="button-group flex gap-5 justify-end">
            <Button className="border-b bg-blue-500" onClick={updateComment}>
              <FaCheck />
            </Button>
            <Button className="bg-red-500" onClick={() => setCommentEditing(false)}>
              <FaTimes />
            </Button>
          </div>
          </div>: <p className="p-3">{comment.content}</p>
        }
      </div>
    </div>
  );
}
