import { Router } from 'express';
import upload from '../middlewares/upload.js';

const uploadAPI = Router();

uploadAPI.post('/upload', upload, (req, res) => {
  const { files } = req.body;

  console.log(files);

  res.status(200).json({ message: '上传成功!' });
});

export default uploadAPI;
