import { Router } from "express";
import customersController from "./app/controllers/CustomersController.js";
import contactsController from "./app/controllers/ContactsControllers.js";
import usersController from "./app/controllers/UsersController.js";

const routes = new Router();

// Rota dos clientes
routes.get("/customers", customersController.index);
routes.get("/customers/:id", customersController.show);
routes.post("/customers", customersController.create);
routes.patch("/customers/:id", customersController.update);
routes.delete("/customers/:id", customersController.destroy);

// Rota dos contatos "Rota aninhada com customers pois sao contatos de clientes"
routes.get("/customers/:customerId/contacts", contactsController.index);
routes.get("/customers/:customerId/contacts/:id", contactsController.show);
routes.post("/customers/:customerId/contacts", contactsController.create);
routes.patch("/customers/:customerId/contacts/:id", contactsController.update);
routes.delete("/customers/:customerId/contacts/:id", contactsController.destroy);

// Rota de usuarios
routes.get("/users", usersController.index);
routes.get("/users/:id", usersController.show);
routes.post("/users", usersController.create);
routes.patch("/users/:id", usersController.update);
routes.delete("/users/:id", usersController.destroy);


export default routes;
