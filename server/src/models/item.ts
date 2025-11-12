
import db from '../data/db';

export const getAllItems = () => {
  return db('items');
};

export const getItemById = (id: number) => {
  return db('items').where({ id }).first();
};

export const createItem = (item: any) => {
  return db('items').insert(item);
};

export const updateItem = (id: number, item: any) => {
  return db('items').where({ id }).update(item);
};

export const deleteItem = (id: number) => {
  return db('items').where({ id }).del();
};

export const searchItems = (query: string) => {
  return db('items').where('name', 'like', `%${query}%`);
};
