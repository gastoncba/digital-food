import express, { Request, Response } from 'express';
import cors from 'cors'

import { routerApi } from './routes';
import { logError, errorHandler, boomErrorHandler } from './middleware';
import { config } from './config/config';
import { initializeStrategies } from './utils/auth';

const app = express();
const port = config.port;

app.use(express.json())
app.use(cors())

initializeStrategies();

app.get('/', (req:Request, res: Response) => {
  res.send('API DIGITAL FOOD');
});

routerApi(app)
app.use(logError);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Server up!")
});
