
import db from '../data/db';
import bcrypt from 'bcrypt';

export const findUserByUsername = (username: string) => {
  return db('users').where({ username }).first();
};

export const createUser = async (user: any) => {
  const { username, password } = user;
  const hashedPassword = await bcrypt.hash(password, 10);
  return db('users').insert({ username, password: hashedPassword });
};
