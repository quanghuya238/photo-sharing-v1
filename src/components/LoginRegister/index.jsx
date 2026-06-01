import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://yfjqns-8081.csb.app";

function LoginRegister({ onLogin }) {
  const navigate = useNavigate();
  const [form,setForm]=useState({
    login_name:"",
    password:"",
  });
  const [reg, setReg] = useState({
    login_name: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });

  const handleLogin = async () => {
    const response = await fetch(`${BASE_URL}/admin/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!response.ok) return;
    const user = await response.json();
    if (!user?._id) return;
    onLogin(user);
    navigate(`/users/${user._id}`);
  };

  const handleRegister = async () => {
    if (!reg.login_name || !reg.password || !reg.first_name || !reg.last_name) return;
    if (reg.password !== reg.password2) return;
    const response = await fetch(`${BASE_URL}/user`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reg),
    });
    if (!response.ok) return;
    setReg({
      login_name: "", password: "", password2: "",
      first_name: "", last_name: "",
      location: "", description: "", occupation: "",
    });
  };

  return (
    <div style={{ display: "flex", gap: 40, padding: 20 }}>
      <div>
        <h3>Login</h3>
        <div>
          <input placeholder="Login Name" 
            onChange={(e) => setForm({...form,login_name:e.target.value})} />
        </div>
        <div>
          <input placeholder="Password" type="password" 
            onChange={(e) => setForm({...form,password:e.target.value})} />
        </div>
        <button onClick={handleLogin}>Login</button>
      </div>

      <div>
        <h3>Register</h3>
        <div><input placeholder="Login Name *" value={reg.login_name}
          onChange={(e) => setReg({ ...reg, login_name: e.target.value })} /></div>
        <div><input placeholder="Password *" type="password" value={reg.password}
          onChange={(e) => setReg({ ...reg, password: e.target.value })} /></div>
        <div><input placeholder="Confirm Password *" type="password" value={reg.password2}
          onChange={(e) => setReg({ ...reg, password2: e.target.value })} /></div>
        <div><input placeholder="First Name *" value={reg.first_name}
          onChange={(e) => setReg({ ...reg, first_name: e.target.value })} /></div>
        <div><input placeholder="Last Name *" value={reg.last_name}
          onChange={(e) => setReg({ ...reg, last_name: e.target.value })} /></div>
        <div><input placeholder="Location" value={reg.location}
          onChange={(e) => setReg({ ...reg, location: e.target.value })} /></div>
        <div><input placeholder="Description" value={reg.description}
          onChange={(e) => setReg({ ...reg, description: e.target.value })} /></div>
        <div><input placeholder="Occupation" value={reg.occupation}
          onChange={(e) => setReg({ ...reg, occupation: e.target.value })} /></div>
        <button onClick={handleRegister}>Register Me</button>
      </div>
    </div>
  );
}

export default LoginRegister;