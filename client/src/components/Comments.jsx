import { Dropdown, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";

import { useSelector } from "react-redux";
import Comment from "./Comment.jsx";

export default function Comments({ postId }) {
  const { currentUser } = useSelector((state) => state.user);

  const [postComments, setPostComments] = useState([]);

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


  function getDateTimeDiff(date1) {
    const d1 = new Date(date1);
    const d2 = new Date(new Date().toLocaleDateString());

    if (isNaN(d1) || isNaN(d2)) {
      throw new Error("Invalid date format");
    }

    // Calculate the difference in milliseconds
    const diffInMs = Math.abs(d2 - d1);

    // Convert milliseconds to days
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    const diffInSeconds = Math.floor(diffInMs / 1000); // Total seconds
    const diffInMinutes = Math.floor(diffInSeconds / 60); // Total minutes
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInDays > 0) return diffInDays + "d ago";
    else return "today";
  }

  return (
    <div className="w-full min-h-10 my-10">
      <div className="text-2xl border-b border-slate-500 py-4 mt-10 ps-2 flex gap-2">
        <h1>Comments</h1>
        <div className="border border-b border-black px-3 py-1 text-xl">
          <p>{postComments.length}</p>
        </div>
      </div>
      {postComments.length === 0 && <p>No comments found</p>}
      {postComments.length > 0 &&
        postComments.map((comment, index) => {
          return (
            <>
              <Comment key={comment._id} comment={comment} index={index}  />
            </>
          );
        })}
    </div>
  );
}
