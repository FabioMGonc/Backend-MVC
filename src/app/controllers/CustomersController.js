import Customer from "../models/Customer.js";
import { Op } from "sequelize";
import { parseISO, isValid } from "date-fns";
import Contact from "../models/Contact.js";

class CustomersController {

    // Lista todos clientes
    async index(req, res) {
        const {name, email, createdBefore, createdAfter, updatedBefore, updatedAfter, sort} = req.query;
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        let where = {};
        let order = [];
        let offset = (page - 1) * limit;

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

        const data = await Customer.findAll({
            where: where,
            include: [
                {
                    model: Contact,
                    attributes: ["id"],
                }
            ],
            limit: limit,
            offset: offset,
            order: order,
        });

        return res.json(data);
    }

    // Mostra um cliente por ID especifico
    async show(req, res) {
        const id = Number(req.params.id);
        const customer = await Customer.findByPk(id);

        const status = customer ? 200 : 404;

        return res.status(status).json(customer || {error: "Cliente não encontrado!"});
    }

    // Cria um novo cliente
    async create(req, res) {
        const {name, email} = req.body;

        // Validação se os dados estão presentes
        if(!name || !email){ 
            return res.status(400).json({error: "Nome e Email são obrigatórios!"});
        }

        // criação do novo cliente iterando a id com base no tamanho do array
        const newCustomer = await Customer.create({name, email});
        res.status(201).json(newCustomer);
    }

    // Atualiza dados de um cliente ja existente
    async update(req, res) {
        const customer = await Customer.findByPk(Number(req.params.id));

        if(!customer) return res.status(404).json({error: "Cliente não encontrado!"});

        const {name, email} =req.body;
        // Atualiza os dados do cliente usando o método update do Sequelize, passando os novos dados
        if(!name && !email) return res.status(400).json({error: "Pelo menos um campo deve ser fornecido para atualização!"});


        await customer.update({name, email});
        res.status(200).json(customer);
    }

    // Remove um cliente do sistema
    async destroy(req, res) {
        // Busca o cliente pelo ID usando o método findByPk do Sequelize, que retorna o cliente ou null se não encontrado
        const customer = await Customer.findByPk(Number(req.params.id))

        if(!customer) return res.status(404).json({error: "Cliente não encontrado!"});

        // Remove o cliente usando o método destroy do Sequelize, que deleta o registro do banco de dados
        await customer.destroy();

        res.status(204).send();
    }
}

const customersController = new CustomersController();

export default customersController;