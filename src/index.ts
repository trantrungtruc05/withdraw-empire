import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import * as controller from './controller';
import * as withdrawService from './service/withdrawService';
import connection from './db/connection';
var cron = require('node-cron');

const app: Express = express();
const port = 3003;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route("/withdraw/:category").get(controller.withdraw);

cron.schedule('*/5 * * * * *', async () => {
  withdrawService.withdraw();
});

app.listen(port, async () => {
  await connection.sync();
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});