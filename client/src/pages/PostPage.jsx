import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PostPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [post, setPost] = useState([]);
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
        }
      } catch (error) {
        throw error;
      }
    }

    fetchPost();
  }, [postSlug]);

  if (loading)
    return (
      <>
        <div className="min-h-screen min-w-full flex justify-center items-center">
          <Spinner size="xl" className="" />
        </div>
      </>
    );

  return (
    <main className="min-h-screen max-w-[700px] p-4 mx-auto flex flex-col">
      <h1 className="text-2xl font-sans lg:text-4xl text-center">
        {post.title}
      </h1>

      <Button size="sm" pills>
        {post.category}
      </Button>

      <div className="object-cover mt-8 flex justify-center">
        <img
          src={post.image}
          alt={post.title}
          className="max-w-[700px] rounded"
        />
      </div>
    </main>
  );
}
