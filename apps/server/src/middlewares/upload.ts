import multer from 'multer';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const storage = multer.diskStorage({
	destination(req, file, callback) {
		callback(null, path.join(__dirname, '../dist/upload'));
	},
	filename(_, file, callback) {
    const fileName = [file.originalname.split('.')[0], Date.now()].join('_') + path.extname(file.originalname);
    callback(null, fileName);
	},
});

const multipleUpload = multer({ storage }).array('files');
const singleUpload = multer({ storage }).single('file');
export { multipleUpload, singleUpload };
