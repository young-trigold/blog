import { Router } from 'express';
import { multipleUpload, singleUpload } from '../middlewares/upload.js';

const uploadAPI = Router();

uploadAPI.post('/singleUpload', singleUpload, (req, res) => {
	const { file, hostname } = req;
	const fileURL = `http://${hostname}/upload/${file?.filename}`;
	res.status(200).json({ message: '上传成功!', fileURL });
});

uploadAPI.post('/multipleUpload', multipleUpload, (req, res) => {
  const { files, hostname } = req;
	const fileURLs = files?.map((file) => `http://${hostname}/upload/${file?.filename}`);
	res.status(200).json({ message: '上传成功!', fileURLs });
});

export default uploadAPI;
