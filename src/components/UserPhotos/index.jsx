import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("vi-VN");
}

function UserPhotos({ setTitle, currentUser, reloadPhotos }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [userName, setUserName] = useState("");
  const [commentTexts, setCommentTexts] = useState({});

  const loadPhotos = async () => {
    const res = await fetch(`https://yfjqns-8081.csb.app/api/photo/photosOfUser/${userId}`, { credentials: "include" });
    if (!res.ok) return;
    const data = await res.json();
    setPhotos(data);
  };

  useEffect(() => {
    const loadUser = async () => {
      const res = await fetch(`https://yfjqns-8081.csb.app/api/user/${userId}`, { credentials: "include" });
      if (!res.ok) return;
      const u = await res.json();
      setUserName(`${u.first_name} ${u.last_name}`);
      setTitle(`Photos of ${u.first_name} ${u.last_name}`);
    };
    loadUser();
    loadPhotos();
  }, [userId, reloadPhotos]);

  const handleComment = async (photoId) => {
    const text = commentTexts[photoId] || "";
    if (!text.trim()) return;
    const res = await fetch(`https://yfjqns-8081.csb.app/api/comment/commentsOfPhoto/${photoId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: text }),
    });
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
    <div>
      <h3>Photos of {userName}</h3>
      {photos.length === 0 && <p>Loading...</p>}
      {photos.map((photo) => (
        <div key={photo._id} style={{ marginBottom: 32, borderBottom: "1px solid #ccc", paddingBottom: 16 }}>
          <img
            src={photo.file_name.startsWith("http") ? photo.file_name : `/images/${photo.file_name}`}
            alt="photo"
            style={{ maxWidth: "100%", maxHeight: 500 }}
          />
          <p style={{ color: "gray", fontSize: 12 }}>{formatDate(photo.date_time)}</p>
          <b>Comments ({photo.comments.length})</b>
          {photo.comments.map((c) => (
            <div key={c._id} style={{ margin: "8px 0", paddingLeft: 12, borderLeft: "2px solid #ccc" }}>
              <span style={{ cursor: "pointer", color: "blue" }} onClick={() => navigate(`/users/${c.user._id}`)}>
                {c.user?.first_name} {c.user?.last_name}
              </span>
              {" - "}{formatDate(c.date_time)}
              <p style={{ margin: 0 }}>{c.comment}</p>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              placeholder="Add a comment..."
              value={commentTexts[photo._id] || ""}
              onChange={(e) => setCommentTexts({ ...commentTexts, [photo._id]: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleComment(photo._id)}
            />
            <button onClick={() => handleComment(photo._id)}>Send</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserPhotos;