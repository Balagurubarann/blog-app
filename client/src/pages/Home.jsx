import React, { useEffect, useState } from 'react'
import Post from '../components/Post';

export default function Home() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {

    async function getAllPosts() {

      try {

        const response = await fetch(`/api/post/`);

        const data = await response.json();

        if (response.ok) {
          setPosts(prev => [...prev, ...data.posts]);
        }

      } catch (error) {
        throw error;
      }

    } 

    getAllPosts();

  }, []);

  return (
    <div className="mx-auto max-w-[700]"> 
    {
      posts.map(post => {
        return <Post post={post} key={post._id} />
      })
    } 
    </div>
  )
}
