import jwt from "jsonwebtoken";
import "dotenv/config";

const secret = process.env.SECRET_KEY;


export default function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: "Usuário não logado! Digite suas credenciais."})
    }

    const [bearer, token ] = authHeader.split(" ");

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        return next();
    } catch {
        return res.status(401).json({ error: "Token inválido"})
    }
};
