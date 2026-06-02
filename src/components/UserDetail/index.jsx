import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

function UserDetail({ setTitle }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://yfjqns-8081.csb.app/api/user/${userId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setTitle(`${data.first_name} ${data.last_name}`);
      });
  }, [userId]);

  if (!user) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5">
        {user.first_name} {user.last_name}
      </Typography>
      {user.location && <p>Location: {user.location}</p>}
      {user.occupation && <p>Occupation: {user.occupation}</p>}
      {user.description && <p>{user.description}</p>}
      <Button variant="contained" onClick={() => navigate(`/photos/${userId}`)}>
        View Photos
      </Button>
    </Box>
  );
}

export default UserDetail;
