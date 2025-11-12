
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRouter from './api/auth';
import itemsRouter from './api/items';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
