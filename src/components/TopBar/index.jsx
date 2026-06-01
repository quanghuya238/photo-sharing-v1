import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import "./styles.css";

function TopBar({ currentUser, handleLogout, title, onPhotoUploaded }) {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    const response = await fetch(`https://yfjqns-8081.csb.app/api/photo/new`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (response.ok) onPhotoUploaded();
    e.target.value = "";
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" sx={{ mr: 2 }}>
          Nguyen Quang Huy
        </Typography>
        {currentUser ? (
          <>
            <Typography variant="h5" color="inherit" sx={{ flex: 1 }}>
              {title}
            </Typography>
            <Button color="inherit" sx={{ mr: 2 }} component="label">
              Add Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleUpload}
              />
            </Button>
            <Typography variant="h5" color="inherit" sx={{ mr: 2 }}>
              Hi {currentUser.first_name}!
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Typography variant="h5" color="inherit">
            Please Login
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;