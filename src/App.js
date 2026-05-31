import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [title, setTitle] = useState("");
  const [reloadPhotos, setReloadPhotos] = useState(0);

  return (
    <BrowserRouter>
      <TopBar
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        title={title}
        onPhotoUploaded={() => setReloadPhotos((n) => n + 1)}
      />
      <div style={{ marginTop: 48 }}>
        {!currentUser ? (
          <LoginRegister onLogin={setCurrentUser} />
        ) : (
          <div style={{ display: "flex" }}>
            <div style={{ width: 240, borderRight: "1px solid #ccc" }}>
              <UserList />
            </div>
            <div style={{ flex: 1, padding: 16 }}>
              <Routes>
                <Route
                  path="/users/:userId"
                  element={<UserDetail setTitle={setTitle} />}
                />
                <Route
                  path="/photos/:userId"
                  element={
                    <UserPhotos
                      setTitle={setTitle}
                      currentUser={currentUser}
                      reloadPhotos={reloadPhotos}
                    />
                  }
                />
                <Route
                  path="*"
                  element={<Navigate to={`/users/${currentUser._id}`} />}
                />
              </Routes>
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
