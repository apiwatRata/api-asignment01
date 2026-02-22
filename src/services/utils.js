module.exports = {
    randomInt:   (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomNumber:   (min, max) => {
        return Math.random() * ((max) - (min) + 1) + (min);
    },

    sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    errorResponseBody: (status_code, user_id) =>{
        switch (status_code) {
            case 400:
                return {"error": "invalid_parameter", "message": "Invalid limit parameter"};
            case 404:
                return {"error": "user_not_found", "message": "User with ID {user_id} does not exist".replace("{user_id}",user_id)};
            case 500:
                return {"error": "internal_error", "message": "An unexpected error occurred"}
            case 503:
                return {"error": "model_unavailable", "message": "Recommendation model is temporarily unavailable"}
        }
    }
}