import { Button, Textarea } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function CommentSection() {
  const { currentUser } = useSelector((state) => state.user);

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
          <div className="comment-box flex flex-col gap-4">
            <Textarea
              className="h-40 resize-none"
              placeholder="Write here ..."
            />
            <Button gradientDuoTone="purpleToBlue" outline>
              Post comment
            </Button>
          </div>
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
