import express from 'express';
import knex from './database/connection';

import PointsController from './controllers/pointsController';

const routes = express.Router();

const pointsController = new PointsController();

routes.get('/items', async (request, response) => {
  const items = await knex('items').select('*');

  const serializedItems = items.map(item =>{
    return {
      id: item.id,
      title: item.title,
      imgUrl: `http://localhost:3333/uploads/${item.image}`
    }
  });

  response.json(serializedItems);
});

routes.post('/points', pointsController.create);

export default routes;