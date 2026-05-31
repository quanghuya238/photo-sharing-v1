import React, { useState } from "react";
import { fetchModel } from "../../lib/fetchModelData";
import { useNavigate } from "react-router-dom";
function LoginRegister({ onLogin }) {
  const navigate = useNavigate();
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
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
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(`https://yfjqns-8081.csb.app/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_name: loginName,
          password: loginPassword,
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        setLoginError(text);
        return;
      }
      const user = await response.json();
      if (!user?._id) {
        setLoginError("Login failed");
        return;
      }
      onLogin(user);
      navigate(`/users/${user._id}`);
    } catch (e) {
      setLoginError(e.message);
    }
  };

  const handleRegister = async () => {
    setRegError("");
    setRegSuccess("");
    if (!reg.login_name || !reg.password || !reg.first_name || !reg.last_name)
      return setRegError("Missing required fields");
    if (reg.password !== reg.password2)
      return setRegError("Passwords do not match");
    try {
      const response = await fetch(`https://yfjqns-8081.csb.app/user`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reg),
      });
      if (!response.ok) {
        setRegError(await response.text());
        return;
      }
      setRegSuccess("Registration successful!");
      setReg({
        login_name: "",
        password: "",
        password2: "",
        first_name: "",
        last_name: "",
        location: "",
        description: "",
        occupation: "",
      });
    } catch (e) {
      setRegError(e.message);
    }
  };

  return (
    <div style={{ display: "flex", gap: 40, padding: 20 }}>
      <div>
        <h3>Login</h3>
        <div>
          <input
            placeholder="Login Name"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Password"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </div>
        {loginError && <p style={{ color: "red" }}>{loginError}</p>}
        <button onClick={handleLogin}>Login</button>
      </div>

      <div>
        <h3>Register</h3>
        <div>
          <input
            placeholder="Login Name *"
            value={reg.login_name}
            onChange={(e) => setReg({ ...reg, login_name: e.target.value })}
          />
        </div>
        <div>
          <input
            placeholder="Password *"
            type="password"
            value={reg.password}
            onChange={(e) => setReg({ ...reg, password: e.target.value })}
          />
        </div>
        <div>
          <input
            placeholder="Confirm Password *"
            type="password"
            value={reg.password2}
            onChange={(e) => setReg({ ...reg, password2: e.target.value })}
          />
        </div>
        <div>
          <input
            placeholder="First Name *"
            value={reg.first_name}
            onChange={(e) => setReg({ ...reg, first_name: e.target.value })}
          />
        </div>
        <div>
          <input
            placeholder="Last Name *"
            value={reg.last_name}
            onChange={(e) => setReg({ ...reg, last_name: e.target.value })}
          />
        </div>
        <div>
          <input
            placeholder="Location"
            value={reg.location}
            onChange={(e) => setReg({ ...reg, location: e.target.value })}
          />
        </div>
        <div>
          <input
            placeholder="Description"
            value={reg.description}
            onChange={(e) => setReg({ ...reg, description: e.target.value })}
          />
        </div>
        <div>
          <input
            placeholder="Occupation"
            value={reg.occupation}
            onChange={(e) => setReg({ ...reg, occupation: e.target.value })}
          />
        </div>
        {regError && <p style={{ color: "red" }}>{regError}</p>}
        {regSuccess && <p style={{ color: "green" }}>{regSuccess}</p>}
        <button onClick={handleRegister}>Register Me</button>
      </div>
    </div>
  );
}

export default LoginRegister;
