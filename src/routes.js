import { Router } from "express";
import customersController from "./app/controllers/CustomersController.js";

const routes = new Router();

// Rota dos clientes
routes.get("/customers", customersController.index);
routes.get("/customers/:id", customersController.show);
routes.post("/customers", customersController.create);
routes.patch("/customers/:id", customersController.update);
routes.delete("/customers/:id", customersController.destroy);


export default routes;
