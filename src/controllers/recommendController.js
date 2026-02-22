const UserRepositoty = require('../repositories/userRepository');
const UserWatchHitoryRepository = require('../repositories/userWatchHistoryRepository');
const ContentRepository = require('../repositories/contentRepository');
const { UserWatchHistory } = require('../models');
const { sleep, randomInt, randomNumber} = require('../services/utils');
const { calculateScore } = require('../services/recommend');

async function generateRecommend(user_id = 0, limit = 20){
    const user = await UserRepositoty.userContext(user_id);
    if(!user){
        const error = new Error(`User with ID ${user_id} does not exist`);
        error.statusCode = 404;
        throw error;
    }

    const watch_history = await UserWatchHitoryRepository.watchHistory(user_id,limit);
    const genre_count = {};
    const watch_content_ids = watch_history.map(item => {
        if(genre_count[item.genre])
            genre_count[item.genre] += Number(1);
        else
            genre_count[item.genre] = 1;
        return item.id;
    });
    const genre_preferences = UserWatchHistory.genrePerferences(genre_count);
    const candidates = await ContentRepository.CandidateContent(user_id, limit);

    await sleep(randomInt(30,50));

    if(randomNumber(0,1) < 0.015){
        const error = new Error("Recommendation model is temporarily unavailable");
        error.statusCode = 503;
        throw error;
    }

    const scored_candidateds = [];
    let score = 0;
    for(const candidate of candidates){
        score = calculateScore(candidate, genre_preferences);
        scored_candidateds.push({
            content_id: candidate.id,
            title: candidate.title,
            genre: candidate.genre,
            popularity_score: candidate.popularity_score,
            score: score
        });
    }
    scored_candidateds.sort((a, b) => b.score - a.score);
    return scored_candidateds;
}

async function addWatchHistory(user_id = 0, content_id = 0){
    const user = await UserRepositoty.userContext(user_id);
    if(!user){
        const error = new Error(`User with ID ${user_id} does not exist`);
        error.statusCode = 404;
        throw error;
    }
    const content = await ContentRepository.getContent(content_id);
    if(!content){
        const error = new Error("Invalid limit parameter");
        error.statusCode = 400;
        throw error;
    }
    return await UserWatchHitoryRepository.addWatchHistory(user_id, content_id);
}
module.exports  = {
    generateRecommend,
    addWatchHistory
}