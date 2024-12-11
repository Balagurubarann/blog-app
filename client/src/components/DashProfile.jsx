import { Alert, Button, Modal, Spinner, TextInput } from "flowbite-react";
import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  updateStart,
  updateFailure,
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logoutSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  const {
    currentUser,
    loading,
    error: errorMessage,
  } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);
  const [showModel, setShowModel] = useState(false);

  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  function handleChange(e) {
    return setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleFormUpdate(e) {
    e.preventDefault();

    if (Object.keys(formData).length === 0) {
      setIsUpdated(false);
      dispatch(updateFailure("Can't upload data"));
    }

    try {
      dispatch(updateStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsUpdated(false);
        dispatch(updateFailure(data.message));
      } else {
        setIsUpdated(true);
        dispatch(updateSuccess(data));
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  }

  async function handleDeleteUser(e) {
    setShowModel(false);

    try {
      dispatch(deleteUserStart());

      const response = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = response.json();

      if (!response.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  async function logout() {
    try {
      const response = await fetch("/api/user/logout", {
        method: "POST",
      });

      const data = response.json();

      if (!response.ok) {
        console(data.message);
      } else {
        dispatch(logoutSuccess());
      }
    } catch (error) {
      throw error;
    }
  }

  return (
    <div className="w-full p-3 mx-auto max-w-lg">
      <h1 className="my-7 text-center font-semibold text-3xl dark:text-white">
        Profile
        {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
        {isUpdated && <Alert color="success">Changes Saved</Alert>}
      </h1>
      <form className="flex flex-col gap-5" onSubmit={handleFormUpdate}>
        <input
          type="file"
          name="profile-image"
          id="profile-image"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          className="hidden"
        />
        <div
          className="w-32 h-32 rounded-full overflow-hidden self-center cursor-pointer"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-5 border-gray-900"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          name="username"
          onChange={handleChange}
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          name="email"
          onChange={handleChange}
          defaultValue={currentUser.email}
        />
        <TextInput
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
          placeholder="password"
        />

        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="ps-2">Saving ...</span>
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
        {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a new post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModel(true)}>
          Delete account
        </span>
        <span className="cursor-pointer" onClick={logout}>
          Logout
        </span>
      </div>

      {showModel && (
        <Modal show={showModel} onClose={() => setShowModel(false)}>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-red-700 mx-auto" />
              <h3 className="text-lg">
                Are you sure, you want to delete this account?
              </h3>
              <div className="flex gap-4 justify-center">
                <Button color="failure" onClick={handleDeleteUser}>
                  Yes, delete
                </Button>
                <Button color="gray" onClick={() => setShowModel(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
