import { Router } from 'express';

import noteController from '../controllers/note.js';
import protect from '../middlewares/auth.js';

const noteApi = Router();

noteApi.route('/notes').get(noteController.getNotes).post(noteController.createNote);
noteApi.get('/chapters', noteController.getChapters);
noteApi.get('/chapters/:noteId', noteController.getChaptersByNoteId);

noteApi
  .route('/notes/:chapterId')
  .get(noteController.getChapter)
  .put(protect, noteController.updateChapter);

noteApi.route('/notes/:noteId/:chapterId').delete(protect, noteController.deleteChapter);

noteApi.route('/notes/:noteId').post(noteController.createChapter);

export default noteApi;
