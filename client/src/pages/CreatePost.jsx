import { Badge, Button, FileInput, Select, TextInput } from "flowbite-react";
import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
          <FileInput type="file" accept="image/*" />
          <Button type="button" outline gradientDuoTone="purpleToPink">
            Upload Image
          </Button>
        </div>
        <ReactQuill theme="snow" placeholder="Write here ..." className="h-72 mb-14" required />
        <Button type="submit" gradientDuoTone="purpleToBlue">
            Add Post
        </Button>
      </form>
    </div>
  );
}
