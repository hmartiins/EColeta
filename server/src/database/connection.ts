import knex from 'knex';
import path from 'path';

const connection = knex({
  client: 'mysql',
  connection: {
    filename: path.resolve(__dirname, 'database.mysql'),
  },
});

export default connection;
