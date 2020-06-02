import knex from 'knex';

const configurations = require('../../knexfile.ts');

const connection = knex(configurations.development);

export default connection;
