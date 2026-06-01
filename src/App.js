import './App.css';
import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [title, setTitle] = useState("");
  const [reloadPhotos, setReloadPhotos] = useState(0);

  return (
    <BrowserRouter>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar
              currentUser={currentUser}
              handleLogout={() => setCurrentUser(null)}
              title={title}
              onPhotoUploaded={() => setReloadPhotos((n) => n + 1)}
            />
          </Grid>
          <div className="main-topbar-buffer" />

          {!currentUser ? (
            <Grid item xs={12}>
              <LoginRegister onLogin={setCurrentUser} />
            </Grid>
          ) : (
            <>
              <Grid item sm={3}>
                <Paper className="main-grid-item">
                  <UserList />
                </Paper>
              </Grid>
              <Grid item sm={9}>
                <Paper className="main-grid-item">
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
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      </div>
    </BrowserRouter>
  );
};

export default App;