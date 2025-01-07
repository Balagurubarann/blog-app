import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";

export default function PostPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [post, setPost] = useState([]);
  const [postCreatedBy, setPostCreatedBy] = useState('');
  const [authorData, setAuthorData] = useState({})
  const params = useParams();

  const { postSlug } = params;

  useEffect(() => {
    async function fetchPost(e) {
      try {
        setLoading(true);
        const response = await fetch(`/api/post/get-posts?slug=${postSlug}`);

        const data = await response.json();

        if (!response.ok) {
          setError(true);
          setLoading(false);
        } else {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
          setPostCreatedBy(data.posts[0].userId);
        }
      } catch (error) {
        throw error;
      }
    }

    fetchPost();
  }, [postSlug]);

  useEffect(() => {

    async function fetchUser(userId) {

      try {
        if (userId) {
          const response = await fetch(`/api/user/get-user/${userId}`);
    
          const data = await response.json();
          if (response.ok) {
            setAuthorData(data);
          }
        }
  
      } catch (error) { 
        setError(true);
      }
  
    }

    fetchUser(postCreatedBy);

  }, [postCreatedBy]);
  
  if (loading)
    return (
      <>
        <div className="min-h-screen min-w-full flex justify-center items-center">
          <Spinner size="xl" className="" />
        </div>
      </>
    );

  return (
    <main className="dark:text-white min-h-screen max-w-[700px] p-4 mx-auto flex flex-col">
      <h1 className="text-3xl font-sans  lg:text-4xl text-center max-w-2xl mx-auto">
        {post.title}
      </h1>

      <Link className="self-center mt-5" to={`/search?category=${post && post.category}`}>
        <Button color="gray" size="xs" pill>
          { post && post.category }
        </Button>
      </Link>

      <div className="object-cover mt-8 flex justify-center flex-col gap-5 border-b border-slate-500 py-5">
        <img
          src={post.image}
          alt={post.title}
          className="max-h-[700px] rounded object-cover w-full"
        />
        <div className="text-xs flex justify-between items-center">
          <span>
            {
              authorData && <div className="flex gap-2 items-center">
                <img src={authorData.profilePicture} alt="" className="w-8 h-8 rounded-full" />
                <span className="font-bold">@{authorData.username}</span>
              </div>
            }
          </span>
          <span>
            { post && new Date(post.createdAt).toLocaleDateString() }
          </span>
        </div>
      </div>

      <div className="p-3 max-w-2xl w-full mx-auto text-justify post-content" dangerouslySetInnerHTML={{__html: post && post.content}}></div>

      <CommentSection postId={ post._id } />

    </main>
  );
}
