import Sequelize, {Model} from "sequelize";

class Contact extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            customer_id: Sequelize.INTEGER,
        },
        {
            sequelize,
        }
    )
    }
    // Definindo a associação entre Contact e Customer
    static associate(models) {
        this.belongsTo(models.Customer, {
            foreignKey: "customer_id",
            as: "customer",
        })
    }
}

export default Contact;
