import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchModel } from "../../lib/fetchModelData";

function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchModel("/api/user/list").then((data) => setUsers(data));
  }, []);

  return (
    <div>
      <p>
        <b>Users</b>
      </p>
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => navigate(`/users/${user._id}`)}
          style={{ cursor: "pointer", padding: "8px" }}
        >
          {user.first_name} {user.last_name}
        </div>
      ))}
    </div>
  );
}

export default UserList;
