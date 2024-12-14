import React, { useEffect, useState } from "react";
import { Table, TableCell, TableHeadCell, TableRow } from "flowbite-react";
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
          <Table className="shadow-md" hoverable>
            <Table.Head>
              <Table.Row>
                <TableHeadCell>Created At</TableHeadCell>
                <TableHeadCell>Last Modified</TableHeadCell>
                <TableHeadCell>Image</TableHeadCell>
                <TableHeadCell>Title</TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
                <TableHeadCell>Edit</TableHeadCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              
            </Table.Body>
          </Table>
        </>
      ) : (
        <p>You have no posts</p>
      )}
    </div>
  );
}
