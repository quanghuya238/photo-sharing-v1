import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { BASE_URL } from "../../lib/fetchModelData";

function TopBar({ currentUser, onLogout, title, onPhotoUploaded }) {
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
    <AppBar>
      <Toolbar>
        <Typography fontWeight="bold" sx={{ mr: 2 }}>
          Nguyen Quang Huy
        </Typography>
        <Typography sx={{ flex: 1 }}>{title}</Typography>
        {currentUser ? (
          <>
            <Button color="inherit" sx={{ mr: 2 }} component="label">
              Add Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleUpload}
              />
            </Button>
            <Typography sx={{ mr: 2 }}>Hi {currentUser.first_name}!</Typography>
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Typography>Please Login</Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
