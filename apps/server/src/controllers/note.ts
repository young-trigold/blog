/* eslint-disable consistent-return */
import { Request, Response } from 'express';

import Chapter from '../models/chapter.js';
import Comment from '../models/comment.js';
import Note from '../models/note.js';
import { ChapterInfo, NoteInfo } from '../types/index.js';
import isRelated from '../utils/isRelated.js';

const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find().populate('chapters', ['_id', 'title', 'views', 'likes']);
    const sortedNotes = notes.sort((a, b) => (a.sortedIndex ?? 0) - (b.sortedIndex ?? 0));

    if (notes) {
      res.status(200).json(sortedNotes);
    } else {
      res.status(404).json({ message: '没有找到笔记!' });
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: '服务器错误!', stack: error.stack });
  }
};

const createNote = async (req: Request, res: Response) => {
  const newNote = new Note({
    title: req.body.title,
    chapters: [],
  });

  try {
    await newNote.save();
    res.status(200).json(newNote);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: '服务器错误!', stack: error.stack });
  }
};

const getChapters = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query;
    const notes: NoteInfo[] = await Note.find().populate('chapters', ['title', '_id']);
    let chapters: ChapterInfo[] = [];

    notes.forEach((note) => {
      chapters = chapters.concat(note.chapters);
    });
    const result = chapters.filter((chapter) => isRelated(chapter.title, String(keyword)));

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: '服务器错误!', stack: error.stack });
  }
};

const getChaptersByNoteId = async (req: Request, res: Response) => {
  const { noteId } = req.params;

  try {
    const note: NoteInfo | null = await Note.findById(noteId).populate('chapters', [
      '_id',
      'title',
      'likes',
      'views',
      'createdAt',
      'updatedAt',
    ]);

    if (!note) return res.status(404).json({ message: '没有找到章节!' });

    const { chapters } = note;
    const sortedChapters = chapters.sort(
      (a, b) => Number.parseInt(a.title.slice(0, 2), 10) - Number.parseInt(b.title.slice(0, 2), 10),
    );
    if (chapters) {
      res.status(200).json(sortedChapters);
    } else {
      res.status(404).json({ message: '没有找到章节!' });
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: '服务器错误!', stack: error.stack });
  }
};

const getChapter = async (req: Request, res: Response) => {
  const { chapterId } = req.params;

  try {
    const chapter = await Chapter.findOneAndUpdate(
      { _id: chapterId },
      { $inc: { views: 1 } },
      {
        upsert: true,
      },
    ).populate({ path: 'comments', populate: { path: 'user', model: 'User' } });

    if (chapter) {
      res.status(200).json(chapter);
    } else {
      res.status(404).json({ message: '找不到该章节!' });
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: '服务器错误!', stack: error.stack });
  }
};

const createChapter = async (req: Request, res: Response) => {
  const { noteId } = req.params;
  const { title } = req.body;

  console.log(title);

  try {
    const newChapter = new Chapter({
      title,
    });

    await newChapter.save();

    await Note.findByIdAndUpdate(
      noteId,
      {
        $push: {
          chapters: {
            _id: newChapter._id,
          },
        },
      },
      { safe: true, upsert: true },
    );
    res.status(200).json({ message: '上传成功!' });
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ message: '上传失败!', stack: error.stack });
  }
};

const deleteChapter = async (req: Request, res: Response) => {
  const { noteId, chapterId } = req.params;

  try {
    const chapterRemoved = await Chapter.findByIdAndRemove(chapterId);
    await Note.findByIdAndUpdate(noteId, {
      $pull: { chapters: { _id: chapterRemoved?._id } },
    });

    res.status(200).json({ message: '删除成功!' });
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ message: '删除失败!', stack: error.stack });
  }
};

const updateChapter = async (req: Request, res: Response) => {
  const { user } = req;
  const { chapterId } = req.params;
  const { addLikes, comment, content } = req.body;

  try {
    if (addLikes) {
      const updatedChapter = await Chapter.findOneAndUpdate(
        { _id: chapterId },
        { $inc: { likes: 1 } },
        {
          upsert: true,
        },
      );
      res.status(200).json(updatedChapter);
    }

    if (comment) {
      const newComment = new Comment({
        user: user.id,
        content: comment,
      });

      await newComment.save();

      const updatedChapter = await Chapter.findByIdAndUpdate(
        chapterId,
        {
          $push: {
            comments: {
              _id: newComment._id,
            },
          },
        },
        { safe: true, upsert: true },
      ).populate({ path: 'comments', populate: { path: 'user', model: 'User' } });

      res.status(200).json(updatedChapter);
    }

    if (content) {
      const updatedChapter = await Chapter.findByIdAndUpdate(
        chapterId,
        {
          content,
        },
        { safe: true, upsert: true },
      ).populate({ path: 'comments', populate: { path: 'user', model: 'User' } });

      res.status(200).json(updatedChapter);
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: '服务器错误!', stack: error.stack });
  }
};

export default {
  getNotes,
  createNote,
  getChapter,
  getChapters,
  getChaptersByNoteId,
  createChapter,
  deleteChapter,
  updateChapter,
};
