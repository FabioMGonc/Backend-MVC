import express from "express";
import routes from "./routes.js";

import "./database/index.js";


class serverApp {
    constructor(){
        this.app = express();
        this.middlewares();
        this.routes();
    }
    middlewares(){
        this.app.use(express.json());
    }
    routes(){
        this.app.use(routes);

    }
}

const app = new serverApp().app;

export default app;
