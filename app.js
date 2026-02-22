// require('dotenv').config(); // for dev environment

const express = require("express");
const app = express();
const userRoutes = require("./src/routes/user");
const db = require('./src/models');
const PORT = process.env.PORT || 3000;
const { errorResponseBody } = require('./src/services/utils');
const redisService = require('./src/services/redis');
const recommendController = require('./src/controllers/recommendController');
const userRepository = require('./src/repositories/userRepository');
const e = require("express");
const { performance } = require("perf_hooks");

db.sequelize.sync();
app.use(express.json());

app.use('/users', userRoutes());
app.get('/recommendations/batch', async (req, res) => {
  try{
    res.setTimeout(300000, () => {
      res.status(500).json(errorResponseBody(500));
    });

    const start = performance.now();
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    if(isNaN(page) || page < 0 || isNaN(limit) || limit < 0 || limit > 100) {
      const error = new Error("Invalid Parameters");
      error.statusCode = 400; // Bad Request
      throw error;
    }
    const users = await userRepository.getUsersContext(limit, (page - 1) * limit);
    const totalUsers = await userRepository.countUsers();
    const summary = {
      succes_count: 0,
      failed_count: 0,
      processing_time_ms: 0,
    }
    let recommendations = [];
    const results = [];
    for (const user of users) {
      try{
        recommendations = await recommendController.generateRecommend(user.id);
        summary.succes_count += 1;
        results.push({
          user_id: user.id,
          recommendations: recommendations,
          status: 'success'
        });
      }catch(err){
        const statusCode = err.statusCode || 500;
        summary.failed_count += 1;
        results.push({
          user_id: user.id,
          status: 'failed',
          error: errorResponseBody(statusCode).error,
          message: errorResponseBody(statusCode).message
        });
      }
    }
    const end = performance.now();
    summary.processing_time_ms = (end - start).toFixed(3); // ms
    return res.json({
      page,
      limit,
      total_users: totalUsers,
      results,
      summary,
      metadata:{
        generated_at: new Date().toISOString()
      }
    });
  }catch(e){
    console.log(e);
    if(e.statusCode === 404){
      return res.status(e.statusCode).json(errorResponseBody(e.statusCode, req.params.user_id));
    }else if(e.statusCode === 400){
      return res.status(e.statusCode).json(errorResponseBody(e.statusCode));
    }else if (e.statusCode === 503){
      return res.status(e.statusCode).json(errorResponseBody(e.statusCode));
    }else{
      return res.status(500).json(errorResponseBody(500));
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
