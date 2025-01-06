import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function CommentSection() {
  const { currentUser } = useSelector((state) => state.user);

  return <>{currentUser ? <div></div> : <div className="flex gap-2">
        <p>You must be logged in to comment.</p>
        <Link to="/login" className="text-blue-600">
            Log in        
        </Link>
    </div>}</>;
}
