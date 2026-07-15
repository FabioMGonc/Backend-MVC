import File from "../models/File.js";

class FilesController {
    async create(req, res) {
        const { originalname, filename} = req.file;

        const file = await File.create({ name: originalname, path: filename });

        return res.json(file);
    }
}

const files =  new FilesController();

export default files;
