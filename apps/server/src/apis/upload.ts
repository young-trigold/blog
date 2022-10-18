import { Router } from 'express';
import upload from '../middlewares/upload.js';

const uploadAPI = Router();

uploadAPI.post('/upload', upload, (req, res) => {
  res.status(200).json({ message: '上传成功!' });
});

export default uploadAPI;
