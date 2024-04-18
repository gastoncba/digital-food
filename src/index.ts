import express, { Request, Response } from 'express';
import cors from 'cors'

import { routerApi } from './routes';
import { logError, errorHandler, boomErrorHandler } from './middleware';

const app = express();

app.use(express.json())
app.use(cors())

app.get('/', (req:Request, res: Response) => {
  res.send('API DIGITAL FOOD');
});

routerApi(app)
app.use(logError);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(8080, () => {
  console.log("Server up!")
});
