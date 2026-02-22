const express = require('express');
const router = express.Router();
const { errorResponseBody } = require('../services/utils');
const recommendController = require('../controllers/recommendController');
function UserRoutes() {
    router.get('/:user_id/recommendations', async (req, res) => {
        try{
            const { user_id } = req.params;
            if(!user_id && isNaN(user_id))
                throw new Error('Invalid parameter',{
                    statusCode: 400,
                })
            const result = await recommendController.generateRecommend(user_id);
            console.log(result);
            return res.json({
                foo: 'bar'
            })

        }catch(e){
            if(e.status === 404){
                return res.status(e.status).json(errorResponseBody(e.status, req.params.user_id));
            }else if(e.status === 400){
                return res.status(e.status).json(errorResponseBody(e.status));
            }else if (e.status === 503){
                return res.status(e.status).json(errorResponseBody(e.status));
            }else{
                return res.status(500).json(errorResponseBody(500));
            }
        }
    })

    return router;
}

module.exports = UserRoutes;