'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    let seed = 24680;
    function random() {

      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }

    const totalUsers = 20;   
    const totalContents = 50; 

    function randomWatch() {
      const userId = Math.floor(random() * totalUsers) + 1;
      const contentId = Math.floor(random() * totalContents) + 1;

      const now = new Date();
      const daysAgo = Math.floor(random() * 90);
      const watchAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      return {
        user_id: userId,
        content_id: contentId,
        watched_at: watchAt
      };
    }


    const watchHistories = Array.from({ length: 200 }, randomWatch);

    await queryInterface.bulkInsert('user_watch_history', watchHistories, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('user_watch_history', null, {});
  }
};
