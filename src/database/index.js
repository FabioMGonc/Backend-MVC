import Sequelize from 'sequelize';
import config from "../config/database.cjs";

import Customer from "../app/models/Customer.js";
import Contact from "../app/models/Contact.js";
import User from "../app/models/User.js";

const models = [Customer, Contact, User];

class Database {
    constructor() {
        this.connection = new Sequelize(config);
        this.init();
    }
    init() {
        // Inicializa os modelos
        models.forEach(model => model.init(this.connection));   
        
        // Configura as associações entre os modelos, se houver
        models.forEach(model => {if(model.associate) {
            model.associate(this.connection.models);
        }})
    }
}

export default new Database();
