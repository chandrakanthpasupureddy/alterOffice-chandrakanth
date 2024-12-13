import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Your Firebase configuration
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // For file uploads
import "./index.css";

const EditProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          setFirstName(docSnap.data().firstName);
          setLastName(docSnap.data().lastName);
          setBio(docSnap.data().bio || "");
          setPhoto(docSnap.data().photo || null);
        }
      }
    };

    fetchUserData();
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `profilePhotos/${auth.currentUser.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      setPhoto(photoURL);
      setUploading(false);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "Users", user.uid);
      await updateDoc(docRef, {
        firstName,
        lastName,
        bio,
        photo, // Updated with uploaded photo URL
      });
      window.location.href = "/profile";
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSaveChanges} className="edit-profile-form">
        <label>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <label>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <label>Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <label>Profile Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
        />
        {uploading && <p>Uploading photo...</p>}
        {photo && <img src={photo} alt="Profile Preview" className="photo-preview" />}
        <button type="submit" disabled={uploading}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
