const express = require("express");
const cors = require("cors");

const models =
  require("./modelData/models.js").default || require("./modelData/models.js");

const app = express();

app.use(cors());
app.use("/images", express.static("images"));

// API 1: /test/info - Dùng để test xem server có chạy không
app.get("/test/info", function (request, response) {
  const info = models.schemaInfo();
  if (!info) {
    return response.status(500).send("Server Error: Missing schema info");
  }
  response.status(200).json(info);
});

// API 2: /user/list - Lấy danh sách tất cả người dùng
app.get("/user/list", function (request, response) {
  const users = models.userListModel();
  if (!users) {
    return response
      .status(500)
      .send("Server Error: Không tìm thấy danh sách user");
  }
  response.status(200).json(users);
});

// API 3: /user/:id - Lấy chi tiết một người dùng cụ thể
app.get("/user/:id", function (request, response) {
  const id = request.params.id;
  const user = models.userModel(id);

  if (!user) {
    console.log("User with _id:" + id + " not found.");
    return response.status(400).send("Không tìm thấy user này");
  }
  response.status(200).json(user);
});

// API 4: /photosOfUser/:id - Lấy danh sách ảnh của một người dùng
app.get("/photosOfUser/:id", function (request, response) {
  const id = request.params.id;
  const photos = models.photoOfUserModel(id);

  if (!photos || photos.length === 0) {
    console.log("Photos for user with _id:" + id + " not found.");
    // Mặc dù không có ảnh, vẫn nên trả về mảng rỗng [] thay vì báo lỗi 400
    return response.status(200).json([]);
  }
  response.status(200).json(photos);
});

const port = 8080;
app.listen(port, function () {
  console.log(
    `🚀 Backend Server đang chạy tại địa chỉ: http://localhost:${port}`,
  );
});
