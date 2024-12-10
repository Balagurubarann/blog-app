import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateStart, updateFailure, updateSuccess } from "../redux/user/userSlice";

export default function DashProfile() {
  const { currentUser, loading, error: errorMessage } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);

  const filePickerRef = useRef();
  const dispatch = useDispatch();

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
      setIsUpdated(false)
      dispatch(updateFailure("Can\'t upload data"));
    }

    try {
      dispatch(updateStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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

  return (
    <div className="w-full p-3 mx-auto max-w-lg">
      <h1 className="my-7 text-center font-semibold text-3xl dark:text-white">
        Profile
        {
          errorMessage && (
            <Alert color="failure">
              { errorMessage }
            </Alert>
          )
        }
        {
          isUpdated && (
            <Alert color="success">
              Changes Saved
            </Alert>
          )
        }
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

        <Button type="submit" gradientDuoTone="purpleToBlue" outline disabled={loading}>
          {
            loading ? 
              <>
                <Spinner size="sm" />
                <span className="ps-2">Saving ...</span>
              </>:
            'Save Changes'
          }
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete account</span>
        <span className="cursor-pointer">Logout</span>
      </div>
    </div>
  );
}
