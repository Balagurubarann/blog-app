import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import {
  logInStart,
  logInSuccess,
  logInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

export default function Login() {
  const [formData, setFormData] = useState("");
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }

  async function loginUser(e) {
    e.preventDefault();

    if (!formData.password || !formData.email) {
      return dispatch(logInFailure("All fields are required"));
    }

    try {
      dispatch(logInStart());

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success === false) {
        dispatch(logInFailure(data.message));
      }

      if (response.ok) {
        dispatch(logInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(logInFailure(error.message));
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        {/* LEFT */}
        <div className="flex-1">
          <Link
            to="/"
            className="self-center whitespace-nowrap text-4xl font-semibold dark:text-white flex gap-2 items-center"
          >
            <span className="bg-black rounded p-2 text-white dark:bg-white dark:text-black">
              BLOG
            </span>
            SPOT
          </Link>
          <p className="text-sm mt-5">
            Login with your email to start blogging.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={loginUser}>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                id="email"
                name="email"
                placeholder="name@domain.com"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
              />
            </div>
            <Button
              color={theme === "light" ? "dark" : "blue"}
              type="submit"
              className="text-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="ps-2">Loading ...</span>
                </>
              ) : (
                "Login"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 mt-5 text-sm">
            <span className="dark:text-white">Create an account?</span>
            <Link to="/register" className="text-blue-500">
              Register
            </Link>
          </div>
          {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
        </div>
      </div>
    </div>
  );
}
