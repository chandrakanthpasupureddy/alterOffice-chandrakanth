import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./index.css";
import { toast } from "react-toastify";

const CreatePostPage = () => {
  const [content, setContent] = useState(""); // Post content
  const [images, setImages] = useState([]); // Image files
  const [video, setVideo] = useState(null); // Video file
  const [loading, setLoading] = useState(false); // Loading state
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const uploadFiles = async (files, folderName) => {
    const storage = getStorage();
    const uploadPromises = files.map(async (file) => {
      const fileRef = ref(storage, `${folderName}/${auth.currentUser.uid}/${file.name}`);
      await uploadBytes(fileRef, file);
      return getDownloadURL(fileRef);
    });
    return Promise.all(uploadPromises);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = auth.currentUser;
    if (user) {
      try {
        let imageUrls = [];
        let videoUrl = null;

        // Upload images if any
        if (images.length > 0) {
          imageUrls = await uploadFiles(images, "images");
        }

        // Upload video if any
        if (video) {
          const videoUrls = await uploadFiles([video], "videos");
          videoUrl = videoUrls[0];
        }

        // Add post to Firestore
        await addDoc(collection(db, "Posts"), {
          content,
          username: user.displayName,
          userProfilePic: user.photoURL,
          createdAt: Timestamp.fromDate(new Date()),
          likeCount: 0,
          shareCount: 0,
          imageUrls, // Array of uploaded image URLs
          videoUrl, // Single uploaded video URL
        });

        // Reset form
        setContent("");
        setImages([]);
        setVideo(null);
        setLoading(false);
        toast.success("Post created successfully!");
        window.location.href = "/feeds";
      } catch (error) {
        console.error("Error creating post: ", error);
        setLoading(false);
        toast.error("Failed to create post.");
      }
    } else {
      toast.error("No user is logged in.");
      setLoading(false);
    }
  };
  return (
    <div className="create-post-container">
      <h2>Create a New Post</h2>
      <form onSubmit={handlePostSubmit} className="create-post-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows="5"
          required
          className="te"
        />
        <label>Upload Images (Multi-select supported)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <label>Upload Video</label>
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
        />
        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Submitting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
