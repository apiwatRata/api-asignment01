// โหลด Express
const express = require("express");
const app = express();

// กำหนดพอร์ต
const PORT = process.env.PORT;

// กำหนด route หลัก
app.get("/", (req, res) => {
  res.send("Hello from Node.js + Express!");
});

// ตัวอย่าง route เพิ่มเติม
app.get("/about", (req, res) => {
  res.send("This is the About page.");
});

// เริ่มต้น server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});