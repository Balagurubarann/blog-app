import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiPencil, HiTrash } from "react-icons/hi";

export default function DashPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(
          `/api/post/get-posts?userId=${currentUser._id}`
        );

        const data = await response.json();

        console.log(data.posts);

        if (!response.ok) {
          console.log("Can't get posts");
        } else {
          setUserPosts(data.posts);
        }
      } catch (error) {
        throw error;
      }
    }

    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  return (
    <div>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table
            className="shadow-md table-fixed w-full"
            hoverable
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <Table.Head className="text-center">
              <Table.HeadCell>Created At</Table.HeadCell>
              <Table.HeadCell>Last Modified</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => {
              return (
                <Table.Body className="divide-y">
                  <Table.Row
                    key={post.createdAt}
                    className="text-center dark:text-white"
                  >
                    <Table.Cell>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Table.Cell>
                    <Table.Cell className="flex justify-center">
                      <Link to={`/posts/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-40 h-20 rounded object-cover bg-gray-500"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/posts/${post.slug}`}>{post.title}</Link>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2 items-center justify-center">
                        <HiTrash className="w-6 h-6 text-red-500 cursor-pointer" />
                        <span>Delete</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/update-post/${post._id}`}
                        className="flex gap-2 items-center justify-center"
                      >
                        <HiPencil className="w-6 h-6 text-blue-500 cursor-pointer" />
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
        </>
      ) : (
        <p>You have no posts</p>
      )}
    </div>
  );
}
