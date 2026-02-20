const express = require('express');
const router = express.Router();

function UserRoutes() {
    router.get('/{user_id}/recommendations', (req, res) => {

    })

    return router;
}

module.exports = UserRoutes;