import express from 'express';
import routes from './routes';

import './database'; // nao precisa pegar index pega automaticamente

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server; // duas formas
// module.exports = new App().server;
