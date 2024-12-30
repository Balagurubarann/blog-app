import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeadCell,
  TableRow,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from "flowbite-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle, HiPencil, HiTrash } from "react-icons/hi";

export default function DashPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [currentDeletionId, setCurrentDeletionId] = useState('');

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
          if (data.posts.length < 3) {
            setShowMore(false);
          }
        }
      } catch (error) {
        throw error;
      }
    }

    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  async function handleShowMore(e) {
    const startIndex = userPosts.length;
    try {
      const response = await fetch(
        `/api/post/get-posts?postId=${currentUser._id}&startIndex=${startIndex}`
      );

      const data = await response.json();

      if (response.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async function handleDeletePost() {
    try {
      setShowDeleteModel(false);
      if (!currentDeletionId) {
        console.log("No Post found");
        return;
      }

      const response = await fetch(
        `/api/post/delete/${currentDeletionId}/${currentUser._id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return data.message;
      } else {
        setUserPosts(prev => prev.filter(post => post._id !== currentDeletionId))
      }

      console.log();
    } catch (error) {
      throw error;
    }
  }

  function handleDeletionModel(post_id) {
    try {

      setCurrentDeletionId(post_id);
      setShowDeleteModel(true);

    } catch (error) {
      throw error;
    }
  }

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
                      <div
                        className="flex gap-2 items-center justify-center cursor-pointer"
                        onClick={() => handleDeletionModel(post._id)}
                      >
                        <HiTrash className="w-6 h-6 text-red-500" />
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
          {showMore && (
            <button
              className="bg-none text-blue-500 self-center w-full py-7"
              onClick={handleShowMore}
            >
              Show more
            </button>
          )}
          {showDeleteModel && (
            <Modal
              show={showDeleteModel}
              onClose={() => setShowDeleteModel(false)}
            >
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <HiOutlineExclamationCircle className="h-14 w-14 text-red-700 mx-auto" />
                  <h3 className="text-lg">
                    Are you sure, you want to delete this post?
                  </h3>
                  <div className="flex gap-4 justify-center">
                    <Button color="failure" onClick={handleDeletePost}>
                      Yes, delete
                    </Button>
                    <Button color="gray" onClick={() => setShowDeleteModel(false)}>
                      No, cancel
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          )}
        </>
      ) : (
        <p>You have no posts</p>
      )}
    </div>
  );
}
