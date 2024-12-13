import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Alert, Spinner } from 'flowbite-react';
import OAuth from "../components/OAuth";
import { useSelector } from "react-redux";

export default function Register() {

  const [formData, setFormData] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useSelector(state => state.theme);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }

  async function registerUser(e) {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.email) {
      return setErrorMessage("All fields are required!");
    }

    try {

      setLoading(true);
      setErrorMessage(null);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: 'include'
      })

      const data = await response.json();

      if (data.success === false) {
        return setErrorMessage(data.message);
      }

      setLoading(false);

      if (response.ok) {
        navigate('/');
      }

    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
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
            Register with your email to start blogging.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={registerUser}>
            <div>
              <Label value="Username" />
              <TextInput type="text" id="username" name="username" onChange={ handleChange } />
            </div>
            <div>
              <Label value="Email" />
              <TextInput type="email" id="email" name="email" placeholder="name@domain.com" onChange={ handleChange } />
            </div>
            <div>
              <Label value="Password" />
              <TextInput type="password" id="password" name="password" onChange={ handleChange } />
            </div>
            <Button color={theme === 'light'? 'dark': 'blue'} type="submit" className="text-xl" disabled={ loading }>
              {
                loading? (
                    <>
                      <Spinner size='sm' />
                      <span className="ps-2">Loading ...</span>
                    </>
                ): 'Register'
              }
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 mt-5 text-sm">
              <span className="dark:text-white">Have an account?</span>
              <Link to="/login" className="text-blue-500">
                Login
              </Link>
            </div>
            {
              errorMessage && (
                <Alert color="failure">
                  {errorMessage}
                </Alert>
              )
            }
        </div>
      </div>
    </div>
  );
}
