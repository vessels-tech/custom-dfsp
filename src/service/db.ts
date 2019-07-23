const environment = process.env.NODE_ENV || 'development';
//TODO: update this to use the proper config, not knex
const config = require('../../config/knexfile.js')[environment];

module.exports = require('knex')(config);
