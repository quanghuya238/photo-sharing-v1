import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchModel, BASE_URL } from "../../lib/fetchModelData";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("vi-VN");
}

function UserPhotos({ setTitle, currentUser }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [userName, setUserName] = useState("");
  const [commentTexts, setCommentTexts] = useState({});
  const [commentErrors, setCommentErrors] = useState({});

  const loadPhotos = () => {
    fetchModel(`/api/photo/photosOfUser/${userId}`).then(setPhotos);
  };

  useEffect(() => {
    fetchModel(`/api/user/${userId}`).then((u) => {
      setUserName(`${u.first_name} ${u.last_name}`);
      setTitle(`Photos of ${u.first_name} ${u.last_name}`);
    });
    loadPhotos();
  }, [userId]);

  const handleComment = async (photoId) => {
    const text = commentTexts[photoId] || "";
    if (!text.trim())
      return setCommentErrors({
        ...commentErrors,
        [photoId]: "Cannot be empty",
      });
    try {
      const newComment = await fetchModel(
        `/api/comment/commentsOfPhoto/${photoId}`,
        {
          method: "POST",
          body: JSON.stringify({ comment: text }),
        }
      );
      setPhotos((prev) =>
        prev.map((p) =>
          p._id === photoId
            ? { ...p, comments: [...p.comments, newComment] }
            : p
        )
      );
      setCommentTexts({ ...commentTexts, [photoId]: "" });
      setCommentErrors({ ...commentErrors, [photoId]: "" });
    } catch (e) {
      setCommentErrors({ ...commentErrors, [photoId]: e.message });
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Photos of {userName}</h3>
      </div>
      {photos.length === 0 && <p>No photos yet.</p>}

      {photos.map((photo) => (
        <div
          key={photo._id}
          style={{
            marginBottom: 32,
            borderBottom: "1px solid #ccc",
            paddingBottom: 16,
          }}
        >
          <img
            src={
              photo.file_name.startsWith("http")
                ? photo.file_name
                : `/images/${photo.file_name}` // ← sửa chỗ này
            }
            alt="photo"
            style={{ maxWidth: "100%", maxHeight: 500 }}
          />
          <p style={{ color: "gray", fontSize: 12 }}>
            {formatDate(photo.date_time)}
          </p>

          <b>Comments ({photo.comments.length})</b>
          {photo.comments.map((c) => (
            <div
              key={c._id}
              style={{
                margin: "8px 0",
                paddingLeft: 12,
                borderLeft: "2px solid #ccc",
              }}
            >
              <span
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => navigate(`/users/${c.user._id}`)}
              >
                {c.user?.first_name} {c.user?.last_name}
              </span>
              {" - "}
              {formatDate(c.date_time)}
              <p style={{ margin: 0 }}>{c.comment}</p>
            </div>
          ))}

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              placeholder="Add a comment..."
              value={commentTexts[photo._id] || ""}
              onChange={(e) =>
                setCommentTexts({
                  ...commentTexts,
                  [photo._id]: e.target.value,
                })
              }
              onKeyDown={(e) => e.key === "Enter" && handleComment(photo._id)}
            />
            <button onClick={() => handleComment(photo._id)}>Send</button>
          </div>
          {commentErrors[photo._id] && (
            <p style={{ color: "red" }}>{commentErrors[photo._id]}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserPhotos;
