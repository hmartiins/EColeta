import knex from '../database/connection';
import { Request, Response} from 'express';

class PointsController {
  async index(request: Request, response: Response){
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));
      
    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')

    return response.json(points);
  }
  async create(request: Request, response: Response){
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
      image: 'https://blog.rcky.com.br/wp-content/uploads/2020/01/minimercado.jpg',
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
    
      await trx.commit();

      return response.json({
        id: insertedIds[0],
        ...point,
      }); 
    } catch (err) {
      console.log(err);
      response.status(400).send({error: 'Operation failed'});
    }
  }
  async show(request: Request, response: Response){
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if(!point){
      return response.status(400).send({message: 'point not found'});
    }
  
    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({point, items});
  }
}
export default PointsController;
