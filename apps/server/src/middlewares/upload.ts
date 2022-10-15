import multer from 'multer';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../dist/upload'));
  },
  filename(_, file, cb) {
    console.log(file);
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage }).array('files');

export default upload;
