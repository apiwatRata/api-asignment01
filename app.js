// require('dotenv').config(); // for dev environment

const express = require("express");
const app = express();
const userRoutes = require("./src/routes/user");
const db = require('./src/models');
const PORT = process.env.PORT || 3000;

db.sequelize.sync();
app.use(express.json());

app.use('/users', userRoutes());
app.get('/recommendations/batch', (req, res) => {

});

app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
