import { Button, FileInput, Select, TextInput } from "flowbite-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  updateStart,
  updateFailure,
  updateSuccess,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";

const categories = [
  "adventure",
  "vacation",
  "clothes",
  "food",
  "travel",
  "trending",
  "favorites",
  "electronics",
].sort();

export default function CreatePost() {

  const dispatch = useDispatch();

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) {
      dispatch(updateFailure("No image file found"));
    }
    if (file.size > 2 * 1024 * 1024) {
      dispatch(updateFailure("Image size is greater than 2MB"))
    }

    if (file) {
      uploadImage(file)
    }

  }

  function uploadImage(file) {
    try {
      if (!file) {
        dispatch(updateFailure("No image file found"));
      }

      const cloudFormData = new FormData();
      cloudFormData.append("file", file);
      cloudFormData.append("upload_preset", import.meta.env.VITE_PRESET);
      cloudFormData.append("folder", "blog_app/posts")
      fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: cloudFormData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setImageURL(data.secure_url);
          setFormData(formData => ({ ...formData, profilePicture: data.secure_url }));
        })
        .catch((err) => {
          console.error("Failed to update profile picture")
        });
    } catch (error) {
      console.error("Failed to update profile picture")
    }
  }

  return (
    <div className="min-h-full mx-auto p-3 max-w-3xl">
      <h2 className="text-center text-3xl my-7 font-semibold">
        Create a new post
      </h2>

      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            className="flex-1"
            type="text"
            placeholder="Title"
            required
            id="title"
          />
          <Select>
            <option value="uncategorized">Select a category</option>
            {categories.map((category) => {
              return (
                <option value={category} key={category + new Date().getTime()}>
                  {category[0].toUpperCase() +
                    category.slice(1, category.length)}
                </option>
              );
            })}
          </Select>
        </div>
        <div className="flex gap-2 p-4 border-blue-600 border-2 justify-around rounded">
          <FileInput
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <Button type="button" outline gradientDuoTone="purpleToPink">
            Upload Image
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Write here ..."
          className="h-72 mb-14 dark:text-white"
          required
        />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Publish Post
        </Button>
      </form>
    </div>
  );
}
