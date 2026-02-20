const ContentRepository = require("../repositories/contentRepository");
const { UserWatchHistory, Content } = require('../models');
const { randomNumber } = require('./utils');

function calculateScore(content, genre_score) {
    const popularity_component = Number(content.popularity_score) * 0.4;
    const recency_component = Number(Content.getBoost(content.watched_at)) * 0.15;
    const random_noise = randomNumber(-0.05, 0.05);
    const genre_boost = genre_score[content.genre]? genre_score[content.genre] * 0.35 : 0.1 * 0.35
    return (random_noise * 0.1) + popularity_component + genre_boost + recency_component
}

module.exports = {
    calculateScore
}