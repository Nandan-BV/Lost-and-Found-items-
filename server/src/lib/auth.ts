
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const comparePasswords = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (user: any) => {
  return jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
};
