import multer from "multer";
import { randomUUID } from "crypto";
import { extname, resolve} from "path";

const storage = multer.diskStorage({
        destination: resolve(process.cwd(), "tmp", "uploads"),
        filename: (req, file, callback) => {
            const fileName = `${randomUUID()}${extname(file.originalname)}`;

            callback(null, fileName)
        },
});

export default multer({
    storage,
});
