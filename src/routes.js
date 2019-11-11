import { Router } from 'express';
import UserController from './app/controllers/UserController';
import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import PlansController from './app/controllers/PlansController';
import RegistrationsController from './app/controllers/RegistrationsController';
const routes = new Router();
routes.post('/sessions', SessionController.store);
routes.use(authMiddleware);
routes.get('/plans',PlansController.index);
routes.post('/plans', PlansController.store);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);
routes.get('/registrations', RegistrationsController.index);
routes.post('/registrations', RegistrationsController.store);
routes.put('/registrations/:id', RegistrationsController.update);
routes.delete('/registrations/:id', RegistrationsController.delete);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

routes.put('/users', UserController.update);

export default routes;
// module.exports = routes;
