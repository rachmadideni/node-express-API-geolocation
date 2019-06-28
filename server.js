import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from 'morgan';
import chalk from 'chalk';

const app = express();
const routes = require('./routes');


// const routeIndex = require('./routes');
// const routeAuth = require('./routes/auth');
// const projectRoutes = require('./routes/project');
// const optionsRoutes = require('./routes/options');

const upload = require('./routes/upload');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use('/api/geojson', upload);
routes(app);



// app.use("/api", routeIndex);
// app.use("/api/auth", routeAuth);
// app.use("/api/project", projectRoutes);
// app.use("/api/options", optionsRoutes);
app.listen(process.env.app_port, () => console.log(chalk.blue.bold(`LISTENING ON PORT ${process.env.app_port}`)));