"use strict";

const express = require("express");
const app = express();
const models = require("./models");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/test/info", function(req, res) {
  res.json({ version: 1 });
});

app.get("/user/list", function(req, res) {
  res.json(models.userListModel());
});

app.get("/user/:id", function(req, res) {
  const user = models.userModel(req.params.id);
  if (!user) {
    res.status(400).json({ error: "User not found" });
    return;
  }
  res.json(user);
});

app.get("/photosOfUser/:id", function(req, res) {
  const photos = models.photoOfUserModel(req.params.id);
  if (!photos) {
    res.status(400).json({ error: "Not found" });
    return;
  }
  res.json(photos);
});

app.listen(3001, function() {
  console.log("Backend running at http://localhost:3001");
});