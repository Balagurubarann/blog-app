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
import { HiOutlineExclamationCircle, HiPencil, HiTrash } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUsers() {
  const [users, setUsers] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [currentDeletionId, setCurrentDeletionId] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`/api/user/get-users/`);

        const data = await response.json();

        if (!response.ok) {
          console.log("Can't get posts");
        } else {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        throw error;
      }
    }

    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  async function handleShowMore(e) {
    const startIndex = users.length;
    try {
      const response = await fetch(
        `/api/user/get-users?startIndex=${startIndex}`
      );

      const data = await response.json();

      if (response.ok) {
        setUserPosts((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async function handleDeleteUser() {
    try {
      setShowDeleteModel(false);
      if (!currentDeletionId) {
        console.log("No Post found");
        return;
      }

      const response = await fetch(
        `/api/user/delete/${currentDeletionId}/`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return data.message;
      } else {
        setUsers((prev) =>
          prev.filter((user) => user._id !== currentDeletionId)
        );
      }

      console.log();
    } catch (error) {
      throw error;
    }
  }

  function handleDeletionModel(user_id) {
    try {
      setCurrentDeletionId(user_id);
      setShowDeleteModel(true);
    } catch (error) {
      throw error;
    }
  }

  return (
    <div>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table
            className="shadow-md table-fixed w-full"
            hoverable
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <Table.Head className="text-center">
              <Table.HeadCell>Created At</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => {
              return (
                <Table.Body className="divide-y">
                  <Table.Row
                    key={user.createdAt}
                    className="text-center dark:text-white"
                  >
                    <Table.Cell>
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Table.Cell>
                    <Table.Cell className="flex justify-center">
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-10 h-10 rounded object-cover bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="overflow-hidden">
                      {user.username}
                    </Table.Cell>
                    <Table.Cell className="overflow-hidden text-xs">{user.email}</Table.Cell>
                    <Table.Cell className="grid place-items-center">{user.isAdmin ? (<FaCheck className="text-green-500"/>): (<FaTimes className="text-red-500" />)}</Table.Cell>
                    <Table.Cell>
                      <div
                        className="flex gap-2 items-center justify-center cursor-pointer"
                        onClick={() => handleDeletionModel(user._id)}
                      >
                        <HiTrash className="w-6 h-6 text-red-500" />
                        <span>Delete</span>
                      </div>
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
                    Are you sure, you want to delete this user?
                  </h3>
                  <div className="flex gap-4 justify-center">
                    <Button color="failure" onClick={handleDeleteUser}>
                      Yes, delete
                    </Button>
                    <Button
                      color="gray"
                      onClick={() => setShowDeleteModel(false)}
                    >
                      No, cancel
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          )}
        </>
      ) : (
        <p>You have no Users</p>
      )}
    </div>
  );
}
