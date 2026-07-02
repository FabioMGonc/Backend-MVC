import * as Yup from "yup";
import Customer from "../models/Customer.js";
import { Op } from "sequelize";
import { parseISO, isValid } from "date-fns";
import Contact from "../models/Contact.js";

class ContactsControllers {

    async index(req, res) {
        // Extrai os parâmetros de consulta da requisição, como nome, email, datas de criação e atualização, ordenação, paginação, etc.
        const {name, email, createdBefore, createdAfter, updatedBefore, updatedAfter, sort} = req.query;
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        let where = {customer_id: req.params.customerId};
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

        const data = await Contact.findAll({
            where: where,
            include: [
                {
                    model: Customer,
                    as: "customer",
                    attributes: ["id", "name", "email"],
                    required: true,
                }
            ],
            limit: limit,
            offset: offset,
            order: order,
        });

        return res.json(data);
    }

    async show(req, res) {
            const customerId = Number(req.params.customerId);
            const id = Number(req.params.id);

            if (Number.isNaN(customerId) || Number.isNaN(id)) {
                return res.status(400).json({ error: "Invalid ID!" });
            }

            const contact = await Contact.findOne({
                where: {
                    customer_id: customerId,
                    id,
                },
                attributes: {
                    exclude: ["customer_id", "customerId"]
                },
                include: {
                    model: Customer,
                    as: "customer",
                    attributes: ["id", "name", "email"]
                }
            });

            if (!contact) {
                return res.status(404).json({ error: "Contato não foi encontrado!" });
            }

            return res.json(contact);
    }

    async create(req, res) {
        const customerId = Number(req.params.customerId);

        // 
        if (Number.isNaN(customerId)) {
            return res.status(400).json({ error: "Parametros inválido!" });
        }

        const customer = await Customer.findByPk(customerId);

        if (!customer) {
            return res.status(404).json({ error: "Cliente nao encontrado!"})
        }

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Formato de dados invalido!"});
        }

        const contact = await Contact.create({
            ...req.body,
            customer_id: customerId,
        })

        return res.status(201).json(contact);   
    };

    async update(req, res) {
        const customerId = Number(req.params.customerId);
        const id = Number(req.params.id);

        if (Number.isNaN(customerId) || Number.isNaN(id)) {
            return res.status(400).json({ error: "Parametros invalidos!"});
        }

        const customer = await Customer.findByPk(customerId);

        if (!customer) {
            return res.status(404).json({ error: "Cliente não encontrado!"});
        }

        const contact = await Contact.findOne({
            where: {
                customer_id: customerId,
                id,
            }
        })

        if (!contact) {
            return res.status(404).json({ error: "Contato nao encontrado!"});
        }

        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
        });
        
        if (!(await schema.isValid(req.body))){
            return res.status(400).json({ error: "Formato de dados invalido!"});
        }

        const { name, email } = req.body;

        if (!name && !email) {
            return res.status(400).json({ error: "Preciso de pelo menos um campo para atualizar!"});
        }
        
        const updates = {
            ...(name && { name }),
            ...(email && { email }),
        }

        await contact.update(updates);

        return res.json(contact);
    };
    
    async destroy(req, res) {
        const customerId = Number(req.params.customerId);
        const id = Number(req.params.id);

        if (Number.isNaN(customerId) || Number.isNaN(id)) {
            return res.status(400).json({ error: "Parametros invalidos!"});
        }

        const customer = await Customer.findByPk(customerId);

        if (!customer) {
            return res.status(404).json({ error: "Cliente nao encontrado!"});
        }

        const contact = await Contact.findOne({
            where: {
                customer_id: customerId,
                id,
            }
        })

        if (!contact) {
            return res.status(404).json({ error: "Contato nao encontrado!"});
        }

        await contact.destroy();

        return res.status(204).send();

    };

};

const contactsControllers = new ContactsControllers();

export default contactsControllers;
