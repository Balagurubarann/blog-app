import { Dropdown, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import Comment from "./Comment.jsx";

export default function Comments({ postId }) {
  const { currentUser } = useSelector((state) => state.user);



  return (
    <div className="w-full min-h-10 my-10">
      
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
