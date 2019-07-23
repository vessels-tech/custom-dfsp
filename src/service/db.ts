const environment = process.env.NODE_ENV || 'development';
//TODO: update this to use the proper config, not knex
const config = require('../../config/knexfile.js')[environment];

// const db = require('knex')(config);
import knex from 'knex';

const db = knex(config);

export default db
