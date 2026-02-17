'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('content', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      genre: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      popularity_score: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      }
    });

    
    await queryInterface.addIndex('content', ['genre'], {
      name: 'idx_content_genre'
    });

    await queryInterface.addIndex('content', ['popularity_score'], {
      name: 'idx_content_popularity',
      order: [['popularity_score', 'DESC']]
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('content');
  }
};
