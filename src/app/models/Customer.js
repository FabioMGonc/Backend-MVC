import Sequelize, {Model} from "sequelize";

class Customer extends Model {
  static init(sequelize) {
    super.init({
        name: Sequelize.STRING,
        email: Sequelize.STRING,
    }, {
      sequelize,
    })
  }
  static associate(models) {
    this.hasMany(models.Contact, {
      foreignKey: "customer_id",
      as: "contacts",
    })
  }
}

export default Customer;
