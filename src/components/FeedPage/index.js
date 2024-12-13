import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { IoMdShareAlt } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import "./index.css";

// Function to generate random background color
const getRandomBackgroundColor = () => {
  const colors = [
    "#FFB6C1", "#FFE4B5", "#98FB98", "#ADD8E6", "#FFCC99",
    "#D8BFD8", "#FFFAF0", "#E6E6FA", "#F0E68C", "#FFFACD",
    "#FFFAEE", "#F5F5DC"
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const FeedPage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user details
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            console.log("No such user document!");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        console.log("User not logged in");
      }
    });
  };

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const postsRef = collection(db, "Posts");
      const postsSnap = await getDocs(postsRef);
      const postsList = postsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(postsList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchPosts();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "./login";
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  // Navigate to create post page
  const handleCreatePost = () => {
    window.location.href = "/create-post";
  };
  const onNavigatetoProfile = () =>{
    window.location.href = "/profile"
  }
   return (
    <div className="feed-container">
      {userDetails ? (
        <div>
          {/* Header with Profile and Logout */}
          <div className="hed">
            <div className="profile-section">
              <img
                src={userDetails.photo || "fallbackProfilePic.jpg"} // Fallback image if no profile pic
                width={"60px"}
                height={"60px"}
                alt="profile"
                className="profile-image"
                onClick={onNavigatetoProfile}
              />
              <div className="he">
                <p>Welcome Back,</p>
                <h3>{userDetails.firstName}!</h3>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>

          {/* Feed Displaying Posts */}
            <div className="feed-posts">
                {loading ? (
                <p>Loading posts...</p>
                ) : posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.id} className="post-card" style={{ backgroundColor: getRandomBackgroundColor() }}>
                    {/* First Row: Profile, Name, and Post Time */}
                    <div className="post-header">
                        <img
                        src={post.userProfilePic || "fallbackProfilePic.jpg"} // Fallback image if no profile pic
                        alt="profile"
                        className="post-profile-img"
                        />
                        <div className="post-info">
                        <h4>{post.username}</h4>
                        <p>{formatDistanceToNow(new Date(post.createdAt.seconds * 1000), { addSuffix: true })}</p>
                        </div>
                    </div>

                    {/* Second Row: Post Content */}
                    <div className="post-content">
                        <p>{post.content}</p>
                    </div>

                    {/* Third Row: Like and Share Icons */}
                    <div className="post-actions">
                        <div className="like-button">
                        <span><FaRegHeart /> {post.likeCount || 0}</span> {/* Displaying like count */}
                        </div>
                        <div className="share-button">
                        <span><IoMdShareAlt /> Share</span> {/* Share icon */}
                        </div>
                    </div>
                    </div>
                ))
                ) : (
                <p>No posts to show.</p>
                )}
            </div>

          {/* Floating Button */}
          <button onClick={handleCreatePost} className="floating-button">+</button>
        </div>
      ) : (
        <div>
          <p>Loading user details...</p>
        </div>
      )}
    </div>
  );
};

export default FeedPage;
