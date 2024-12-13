import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase"; // Your Firebase configuration
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

import { IoMdCreate } from "react-icons/io"; // For edit icon
import "./index.css"; // Assume we have a separate CSS for styling

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("No such user!");
        }
      }
    };

    const fetchUserPosts = async () => {
      const postsRef = collection(db, "Posts");
      const postsSnap = await getDocs(postsRef);
      const postsList = postsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(postsList);
    };

    fetchUserData();
    fetchUserPosts();
  }, []);

  // Navigate to the edit profile page
  const handleEditProfile = () => {
    window.location.href ="/edit-profile";
  };

  return (
    <div className="profile-container">
      {userDetails ? (
        <>
          {/* Profile Header */}
          <div className="profile-header">
            <img
              src={userDetails.coverImage || "default-cover.jpg"} // Default cover image if not set
              alt="Cover"
              className="cover-image"
            />
            <div className="profile-info">
              <img
                src={userDetails.photo || "default-profile.jpg"} // Default profile image if not set
                alt="Profile"
                className="profile-picture"
              />
              <div className="profile-details">
                <h2>{userDetails.firstName} {userDetails.lastName}</h2>
                <p>{userDetails.bio || "No bio available."}</p>
                <button onClick={handleEditProfile} className="edit-profile-button">
                  <IoMdCreate /> Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* User Posts */}
          <div className="user-posts">
            <h3>Your Posts</h3>
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="post-card">
                  <p>{post.content}</p>
                </div>
              ))
            ) : (
              <p>No posts to display.</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;
