'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    let seed = 12345;
    function random() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }

 
    const countries = ['TH', 'US', 'JP', 'DE', 'FR', 'GB', 'CN', 'IN', 'BR', 'AU'];

   
    function randomSubscription() {
      const r = random();
      if (r < 0.6) return 'free';     
      if (r < 0.85) return 'basic';   
      return 'premium';               
    }

    function randomUser() {
      return {
        age: Math.floor(random() * 43) + 18,
        country: countries[Math.floor(random() * countries.length)],
        subscription_type: randomSubscription()
      };
    }

    const users = Array.from({ length: 20 }, randomUser);

    await queryInterface.bulkInsert('users', users, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
