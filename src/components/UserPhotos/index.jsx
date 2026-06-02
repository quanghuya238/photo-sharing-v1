import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Divider, Box, TextField, Button } from "@mui/material";
import "./styles.css";

const BASE_URL = "https://yfjqns-8081.csb.app";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("vi-VN");
}

function UserPhotos({ setTitle, currentUser, reloadPhotos }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [userName, setUserName] = useState("");
  const [commentTexts, setCommentTexts] = useState({});

  useEffect(() => {
    fetch(`${BASE_URL}/api/user/${userId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((u) => {
        setUserName(`${u.first_name} ${u.last_name}`);
        setTitle(`Photos of ${u.first_name} ${u.last_name}`);
      });

    fetch(`${BASE_URL}/api/photo/photosOfUser/${userId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setPhotos(data));
  }, [userId, reloadPhotos]);

  const handleComment = async (photoId) => {
    const res = await fetch(
      `${BASE_URL}/api/comment/commentsOfPhoto/${photoId}`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: commentTexts[photoId] }),
      }
    );
    if (!res.ok) return;
    const newComment = await res.json();
    setPhotos((prev) =>
      prev.map((p) =>
        p._id === photoId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
    setCommentTexts({ ...commentTexts, [photoId]: "" });
  };

  return (
    <Box>
      {photos.length === 0 && <Typography>Loading...</Typography>}
      {photos.map((photo) => (
        <Box key={photo._id} sx={{ marginBottom: 4 }}>
          <img
            src={
              photo.file_name.startsWith("http")
                ? photo.file_name
                : `/images/${photo.file_name}`
            }
            alt="photo"
            style={{ maxWidth: "100%", maxHeight: 500 }}
          />
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            Comments
          </Typography>
          {photo.comments.map((c) => (
            <Box
              key={c._id}
              sx={{ pl: 2, borderLeft: "2px solid #ccc", my: 1 }}
            >
              <Typography
                variant="body2"
                component="span"
                sx={{ cursor: "pointer", color: "primary.main" }}
                onClick={() => navigate(`/users/${c.user._id}`)}
              >
                {c.user?.first_name} {c.user?.last_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {" - "}
                {formatDate(c.date_time)}
              </Typography>
              <Typography variant="body2">{c.comment}</Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Add a comment..."
              value={commentTexts[photo._id] || ""}
              onChange={(e) =>
                setCommentTexts({
                  ...commentTexts,
                  [photo._id]: e.target.value,
                })
              }
            />
            <Button
              variant="contained"
              onClick={() => handleComment(photo._id)}
            >
              Send
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default UserPhotos;
