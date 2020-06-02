import express from 'express';

const app =  express();

app.get('/test', (request, response) => {
  response.json({
    name: "henrique"
  })
});

app.listen(3333);
