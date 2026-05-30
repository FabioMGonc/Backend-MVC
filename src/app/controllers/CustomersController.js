import Customer from "../models/Customer.js";


class CustomersController {
    // Lista todos clientes
    async index(req, res) {
        const data = await Customer.findAll({
            limit: 1000
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