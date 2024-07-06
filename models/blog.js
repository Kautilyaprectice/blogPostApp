const { Sequelize } = require('sequelize');

const sequelize = require('../util/database');

const Blog = sequelize.define('blog', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    blogTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    blogAuthor: {
        type: Sequelize.STRING,
        allowNull: false
    },
    blogContent: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    comment: {
        type: Sequelize.STRING
    }

});

module.exports = Blog;