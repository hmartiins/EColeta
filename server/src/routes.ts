import express from 'express';

const routes = express.Router();

routes.get('/', (request, response) => {
  response.json({
    name: "henrique"
  })
});

export default routes;