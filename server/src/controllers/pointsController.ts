import knex from '../database/connection';
import { Request, Response} from 'express';

class PointsController {
  async create (request: Request, response: Response){
    const { 
      name, 
      email, 
      whatsapp, 
      latitude, 
      longitude, 
      city, 
      uf, 
      items 
    } = request.body;
  
    const trx = await knex.transaction();
  
    const point = {
      image: 'hi',
      name, 
      email, 
      whatsapp, 
      latitude, 
      longitude, 
      city, 
      uf
    }

    try {           
      const insertedIds = await trx('points').insert(point);
    
      const pointItems = items.map((item_id: Number) =>{
        return{
          item_id,
          point_id: insertedIds[0]
        };
      });
    
      await trx('point_items').insert(pointItems);
    
      return response.json({
        id: insertedIds[0],
        ...point,
      }); 
    } catch (err) {
      console.log(err);
      response.status(400).send({error: 'Operation failed'});
    }
  }
}
export default PointsController;
