import * as Yup from "yup";
import { Op } from "sequelize";
import { parseISO, isValid } from "date-fns";

import User from "../models/User.js";

class UsersController {
    async index(req,res) {
        const {name, email, createdBefore, createdAfter, updatedBefore, updatedAfter, sort} = req.query;
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        let where = {};
        let order = [];
        let offset = (page - 1) * limit;

        // 
        if (name) {
            where = {
                ...where,
                name: {
                    [Op.iLike]: `%${name}%`,
                }
            }
        }

        if(email) {
            where = {
                ...where,
                email: {
                    [Op.iLike]: `%${email}%`,            
                }
            }
        }

        if (createdBefore) {
            const date = parseISO(createdBefore);

            if (!isValid(date)) {
                return res.status(400).json({ error: "Invalid createdBefore date" })
            }
            where.createdAt = {
                ...where.createdAt,
                [Op.lte]: parseISO(createdBefore),
            }
        }

        if (createdAfter) {
            const date = parseISO(createdAfter);

            if (!isValid(date)) {
                return res.status(400).json({ error: "Invalid createdAfter date" })
            }
            where.createdAt = {
                ...where.createdAt,
                [Op.gte]: parseISO(createdAfter),
            }
        }
        if (updatedBefore) {
            const date = parseISO(updatedBefore);

            if (!isValid(date)) {
                return res.status(400).json({ error: "Invalid updatedBefore date" })
            }
            where.updatedAt = {
                ...where.updatedAt,
                [Op.lte]: parseISO(updatedBefore),
            }
            
        }
        if (updatedAfter) {
            const date = parseISO(updatedAfter);

            if (!isValid(date)) {
                return res.status(400).json({ error: "Invalid updatedAfter date" })
            }

            where.updatedAt = {
                ...where.updatedAt,
                [Op.gte]: parseISO(updatedAfter),
            }
        }
        if (sort) {
            order = sort.split(",").map(item => item.split(":"));
        }

        const data = await User.findAll({
            attributes: {
                exclude: ["password", "password_hash"]
            },
            where: where,
            limit: limit,
            offset: offset,
            order: order,
        });

        return res.json(data);

    };

    async show(req,res) {
        const id = Number(req.params.id);
        const user = await User.findByPk(id, {
            attributes: {
                exclude: ["password", "password_hash"]
            }
        });
        
        if (!user) {
            return res.status(404).json({ error: "Usuario não encontrado"})
        }

        return res.json(user);
    };
    
    async create(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(8),
            provider: Yup.boolean().default(false),    
            passwordConfirmation: Yup.string().when("password", (password, field) => {
                return password ? field.required().oneOf([Yup.ref("password")]) : field;
            })    
        })
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Dados invalidos" });
        }
        const userExists = await User.findOne({ where: { email: req.body.email } });
        if (userExists) {
            return res.status(400).json({ error: "Confira os dados e garanta que ja nao exista um usuario com esse email" });
        }

        const { id, name, email, createdAt, updatedAt } = await User.create(req.body);
        return res.status(201).json({ id, name, email, createdAt, updatedAt });
    };

    async update(req,res) {

    };

    async destroy(req, res) {

    };
}

const usersController = new UsersController();

export default usersController;
