import Sequelize, { Model } from "sequelize";
import bcrypt from "bcrypt";

class User extends Model{
    static init(sequelize){
        super.init({
            name:Sequelize.STRING,
            email:Sequelize.STRING,
            password: Sequelize.VIRTUAL,
            password_hash:Sequelize.STRING,
            provider:Sequelize.BOOLEAN,
            file_id: Sequelize.INTEGER,
            }, 
            {
            sequelize,}
        );
        
        this.addHook("beforeSave", async user => {
        if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 8);
        }
    })
    }
    static associate(models) {
        this.belongsTo(models.File, {
            foreignKey: "file_id",
            as: "file",
        });
    }
    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;
 