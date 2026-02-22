const express = require('express');
const router = express.Router();
const { errorResponseBody } = require('../services/utils');
const redisService = require('../services/redis');
const recommendController = require('../controllers/recommendController');
function UserRoutes() {
    router.get('/:user_id/recommendations', async (req, res) => {
        try{
            const { user_id } = req.params;
            const limit = req.query.limit || 10;
            if(!user_id || isNaN(user_id) || isNaN(limit) || limit < 0 || limit > 50) {
                const error = new Error("Invalid Parameters");
                error.statusCode = 400; // Bad Request
                throw error;
            }
            const cache_key = `rec:user:${user_id}:limit:${limit}`;
            let cache = await redisService.get(cache_key);
            let recommendations = [];
            let metadata = {};
            if(cache){
                cache = JSON.parse(cache);
                recommendations = cache.recommendations;
                metadata = {
                    cache_hit: true,
                    generated_at: cache.generated_at,
                    total_count: Number(cache.total_count) + 1
                };
                cache.total_count = Number(cache.total_count) + 1;
                await redisService.set(cache_key,JSON.stringify(cache));
            }else{
                recommendations = await recommendController.generateRecommend(user_id, limit);
                const generated_at =  new Date().toISOString();
                await redisService.set(cache_key,JSON.stringify({
                    recommendations,
                    generated_at,
                    total_count: 1
                }));
                metadata = {
                    cache_hit: false,
                    generated_at,
                    total_count: 1
                };
            }

            return res.json({
                user_id,
                recommendations,
                metadata
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

    router.get('/:user_id/watch/:content_id', async (req, res) => {
        try{
            const { user_id, content_id } = req.params;
            if(!user_id || isNaN(user_id) || !content_id || isNaN(content_id)) {
                const error = new Error("Invalid Parameters");
                error.statusCode = 400; // Bad Request
                throw error;
            }
            await recommendController.addWatchHistory(user_id, content_id);
            return res.json({
                status:'success',
                metadata:{
                    generated_at: new Date().toISOString()
                }
            })
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

    return router;
}

module.exports = UserRoutes;