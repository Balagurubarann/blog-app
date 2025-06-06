import React from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { logoutSuccess } from "../redux/user/userSlice";
import useAuth from "../hooks/useAuth";

export default function Header() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const { authorized } = useAuth();

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
    <Navbar className="border-b py-6">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white flex gap-2 items-center"
      >
        <span className="bg-black rounded p-2 text-white dark:bg-white dark:text-black">
          BLOG
        </span>
        SPOT
      </Link>
      {currentUser && authorized && (
        <form>
          <TextInput
            type="text"
            placeholder="Search ..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
          />
        </form>
      )}
      <Button className="w-12 h-10 lg:hidden border" color="grey" pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-4 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline border dark:text-white"
          color="grey"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser && authorized ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={currentUser.profilePicture}
                rounded
                className="w-12 h-6"
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                @{currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
          </Dropdown>
        ) : (
          <>
            {/* <Navigate to="/login" /> */}
            <Link to="/login">
              <Button color="dark" outline>
                Log in
              </Button>
            </Link>
          </>
        )}
        <Navbar.Toggle />
      </div>
      {currentUser && authorized && (
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
            <Link to="/">Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={"div"}>
            <Link to="/about">About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/projects"} as={"div"}>
            <Link to="/projects">Projects</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      )}
    </Navbar>
  );
}
