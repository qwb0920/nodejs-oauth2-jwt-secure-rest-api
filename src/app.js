import 'babel-polyfill';

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import { config } from './config/config';
import { router as oauth2Router} from './controllers/oauth2-router';
import { router as usersRouter } from './controllers/users-router';
import { router as apiRouter } from './controllers/api-router';

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/oauth', oauth2Router);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

app.get('/', (req, res) => {
	res.send('Server is working');
});

app.listen(config.http.port, () => {
	console.log(`Server is running http://localhost:${config.http.port}`);
});
