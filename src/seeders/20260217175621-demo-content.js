'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    let seed = 12345;
    function random() {

      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }

    const genres = ['action', 'drama', 'comedy', 'thriller', 'documentary', 'horror'];


    function randomTitle(index) {
      const adjectives = ['Dark', 'Bright', 'Silent', 'Lost', 'Hidden', 'Epic', 'Golden', 'Wild', 'Broken', 'Secret'];
      const nouns = ['Journey', 'Dream', 'World', 'Night', 'Story', 'Legend', 'Battle', 'Love', 'Shadow', 'Game'];
      const adj = adjectives[Math.floor(random() * adjectives.length)];
      const noun = nouns[Math.floor(random() * nouns.length)];
      return `${adj} ${noun} ${index}`;
    }

    function randomMovie(index) {
      return {
        title: randomTitle(index),
        genre: genres[Math.floor(random() * genres.length)],
        popularity_score: parseFloat((random() * 10).toFixed(1)) 
      };
    }

    const movies = Array.from({ length: 50 }, (_, i) => randomMovie(i + 1));

    await queryInterface.bulkInsert('content', movies, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('content', null, {});
  }
};
