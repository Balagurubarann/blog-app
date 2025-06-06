import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import FooterComponent from "./components/FooterComponent";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import useAuth from "./hooks/useAuth";

function App() {
  const { authorized } = useAuth();

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {authorized && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route element={<PrivateRoute />}>
                <Route path="/post/:postSlug" element={<PostPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route element={<AdminPrivateRoute />}>
                <Route path="/create-post" element={<CreatePost />} />
                <Route path={`/update-post/:postId`} element={<UpdatePost />} />
              </Route>
            </>
          )}
        </Routes>
        {/* <FooterComponent /> */}
      </BrowserRouter>
    </>
  );
}

export default App;
