import { useEffect, useState } from "react";

export default function Comments({ postId }) {
  const [postComments, setPostComments] = useState([]);
  const [commentUsers, setCommentUsers] = useState([]);

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

    postComments.forEach((comment) => {
      fetchUser(comment.userId);
    });
  }, [postComments]);

  console.log(postComments);

  return (
    <div className="w-full min-h-10 my-10">
      {postComments.map((comment, index) => {
        return (
          <>
            <div className="my-5 px-5 py-2 flex gap-5 items-center">
              <img
                src={commentUsers[index] && commentUsers[index].profilePicture}
                alt="https://imgs.search.brave.com/VtHaXSbqH1ZMOqr9D39V6nWtacRWYqK01jdkMhcQLyY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzEwLzI5LzY2LzA1/LzM2MF9GXzEwMjk2/NjA1NzVfRFBkd2tu/RWE3aGlFdmVSdWpz/Qm14WExmRnhKTTMx/VUEuanBn"
                className="object-cover rounded-full h-7 w-7"
              />
              <h2 className="font-semibold text-sm">
                {commentUsers[index] && commentUsers[index].username}
              </h2>
              <div className="flex gap-2 font-light text-xs">
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                <span>{new Date(comment.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="px-10 font-light text-sm w-full border-b border-slate-300 pb-4">
              <p>{comment.content}</p>
            </div>
          </>
        );
      })}
    </div>
  );
}
