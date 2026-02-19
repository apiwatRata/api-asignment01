const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const db = require('./src/models');
const PORT = process.env.PORT;

db.sequelize.sync();
app.use(express.json());

app.use('/users', userRoutes());
app.get('/recommendations/batch', (req, res) => {

});
// เริ่มต้น server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
