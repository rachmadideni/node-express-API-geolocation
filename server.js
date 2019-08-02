import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from 'morgan';
import chalk from 'chalk';

const app = express();
const routes = require('./routes');
const upload = require('./routes/upload');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use('/api/geojson', upload);
app.use('/api/static/', express.static('uploads'))
routes(app);

app.listen(process.env.app_port, () => console.log(chalk.blue.bold(`LISTENING ON PORT ${process.env.app_port}`)));