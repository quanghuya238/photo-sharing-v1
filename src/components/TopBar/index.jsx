import React, { useRef } from "react";
import { BASE_URL } from "../../lib/fetchModelData";

function TopBar({ currentUser, onLogout, title, onPhotoUploaded }) {
  const fileInputRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    const response = await fetch(`${BASE_URL}/api/photo/new`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (response.ok) onPhotoUploaded();
    e.target.value = "";
  };

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "8px 16px", background: "#1a237e", color: "white", position: "fixed", top: 0, width: "100%", zIndex: 1000, boxSizing: "border-box" }}>
      <b style={{ marginRight: 16 }}>Quang Huya</b>
      <span style={{ flex: 1 }}>{title}</span>
      {currentUser ? (
        <>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleUpload} />
          <button onClick={() => fileInputRef.current.click()} style={{ marginRight: 16 }}>Add Photo</button>
          <span style={{ marginRight: 16 }}>Hi {currentUser.first_name}!</span>
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <span>Please Login</span>
      )}
    </div>
  );
}

export default TopBar;