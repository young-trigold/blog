import multer from 'multer';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const storage = multer.diskStorage({
	destination(req, file, callback) {
		callback(null, path.join(__dirname, '../public/upload'));
	},
	filename(_, file, callback) {
    const fileName = Date.now() + path.extname(file.originalname);
    callback(null, fileName);
	},
});

const multipleUpload = multer({ storage }).array('files');
const singleUpload = multer({ storage }).single('file');
export { multipleUpload, singleUpload };
