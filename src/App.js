import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import FeedPage from './components/FeedPage'
import ProfilePage from "./components/ProfilePage";
import CreatePostPage from "./components/CreatePostPage";
import EditProfilePage from "./components/EditProfilePage"
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from "./components/firebase";

const App = () => {
  const [user,setUser] = useState();
  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      setUser(user);
    })
  })
  return (
    <Router>
      <Routes>
        <Route path="/" element={user?<Navigate to = "./feeds"/>:<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/feeds" element={<FeedPage />} />
        <Route path = "/create-post" element = {<CreatePostPage/>}/>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
      </Routes>
      <ToastContainer/>
    </Router>
  );
};

export default App;
