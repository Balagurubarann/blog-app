import {
    Alert,
    Button,
    FileInput,
    Select,
    Spinner,
    TextInput,
  } from "flowbite-react";
  import React, { useState, useRef, useEffect } from "react";
  import Quill from "react-quill";
  import "react-quill/dist/quill.snow.css";
  import {
    createPostFailure,
    createPostStart,
    createPostSuccess,
  } from "../redux/user/userSlice.js";
  import { useDispatch, useSelector } from "react-redux";
  import { useNavigate, useLocation } from "react-router-dom";
  
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
    const { loading, error, currentUser } = useSelector((state) => state.user);
    // const [formData, setFormData] = useState({});
    const [imageURL, setImageURL] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [content, setContent] = useState("");
    const [currentFormData, setCurrentFormData] = useState({});
    const [currentPostId, setCurrentPostId] = useState(null);
  
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function fetchCurrentPost() {
            try {

                setCurrentPostId(location.pathname.split('/').at(-1));

                const response = await fetch(`/api/post/get-posts?postId=${currentPostId}`);

                const data = await response.json();

                if (!response.ok) {
                    dispatch(createPostFailure("Can\'t update post"));
                } else {
                    setCurrentFormData(data.posts[0]);
                }

            } catch (error) {
                throw error;
            }
        }
        if (currentUser.isAdmin) {
            fetchCurrentPost();
        } 
    }, [currentPostId]);
  
    function handleImageChange(e) {
      const file = e.target.files[0];
      if (!file) {
        dispatch(createPostFailure("No image file found"));
      }
      if (file.size > 2 * 1024 * 1024) {
        dispatch(createPostFailure("Image size is greater than 2MB"));
      }
  
      if (file) {
        setImageFile(file);
      }
    }
  
    function uploadImage() {
      try {
        console.log(imageFile);
        if (!imageFile) {
          dispatch(createPostFailure("No image file found"));
        }
  
        dispatch(createPostStart());
        const cloudFormData = new FormData();
        cloudFormData.append("file", imageFile);
        cloudFormData.append("upload_preset", import.meta.env.VITE_PRESET);
        cloudFormData.append("folder", "blog_app/posts");
  
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
            setCurrentFormData((formData) => ({ ...formData, image: data.secure_url }));
            console.log(data.secure_url);
            dispatch(createPostSuccess("Image uploaded successfully"));
          })
          .catch((err) => {
            console.error("Failed to update profile picture");
            dispatch(createPostFailure("Failed to update profile picture"));
          });
      } catch (error) {
        console.error("Failed to update profile picture");
        dispatch(createPostFailure("Failed to update profile picture"));
      }
    }
  
    async function updatePost(e) {
      e.preventDefault();
  
      try {
        dispatch(createPostStart());
        const response = await fetch(`/api/post/update-post/${currentPostId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...currentFormData, content }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          dispatch(createPostFailure(data.message));
        } else {
          dispatch(createPostSuccess(data));
          navigate(`/dashboard?tab=posts`);
        }
      } catch (error) {
        dispatch(createPostFailure(error.message));
      }
    }
  
    function handleChange(e) {
      return setCurrentFormData({
        ...currentFormData,
        [e.target.name]: e.target.value,
      });
    }
    
    return (
      <div className="min-h-full mx-auto p-3 max-w-3xl">
        <h2 className="text-center text-3xl my-7 font-semibold">
          Update Post
          {error && <Alert color="failure">{error}</Alert>}
        </h2>
  
        <form className="flex flex-col gap-4" onSubmit={updatePost}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              className="flex-1"
              type="text"
              placeholder="Title"
              required
              id="title"
              name="title"
              onChange={handleChange}
              value={currentFormData.title}
            />
            <Select onChange={handleChange} value={currentFormData.category} name="category" id="category">
              <option value="uncategorized">
                Select a category
              </option>
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
          <div className="flex flex-col gap-4 p-4 border-blue-600 border-2 rounded">
            <div className="flex gap-2 justify-around">
              <FileInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button
                type="button"
                outline
                gradientDuoTone="purpleToPink"
                onClick={uploadImage}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="ps-2">Upload Image</span>
                  </>
                ) : (
                  "Upload Image"
                )}
              </Button>
            </div>
            {(currentFormData.image) && <img src={currentFormData.image} className="w-full h-52 block" />}
          </div>
  
          <Quill
            theme="snow"
            className="w-full h-72 mb-12"
            onChange={setContent}
            value={content}
          />
  
          <Button type="submit" gradientDuoTone="purpleToBlue" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="ps-2">Publish Post</span>
              </>
            ) : (
              "Publish Post"
            )}
          </Button>
        </form>
      </div>
    );
  }
  