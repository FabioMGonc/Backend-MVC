import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User.js";

const secret = process.env.SECRET_KEY;

class SessionsController {
    async create(req, res) {
        
        const { email, password } = req.body;

        const user = await User.findOne({
            where: {email},
        });

        if(!user) {
            return res.status(401).json({ error: "Usuário não encontrado!"})
        }
        
        if(!(await user.checkPassword(password))){
            return res.status(401).json({ error: "Senha inválida!"})
        }

        const { id, name} = user;

        const token = jwt.sign(
            {id, name},
            secret,
            {expiresIn: "7d"}
        )

        return res.json({
            user: {
                id,
                name, 
                email,
            },
            token: token,
        })
    };
};

const sessions = new SessionsController;

export default sessions;
