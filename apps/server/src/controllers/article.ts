import { Request, Response } from 'express';

import Article from '../models/article.js';
import Comment from '../models/comment.js';
import isRelated from '../utils/isRelated.js';

const getArticles = async (req: Request, res: Response) => {
  const { keyword } = req.query;

  if (keyword) {
    const articles = await Article.find({}, { content: 0 });
    const result = articles.filter((article) => isRelated(article.title, String(keyword)));

    res.status(200).json(result);
  } else {
    try {
      const tags = await Article.aggregate([
        {
          $group: {
            _id: '$tag',
            articles: { $addToSet: '$$ROOT' },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            'articles.content': 0,
          },
        },
      ]);

      const result = tags.sort((a, b) => b.count - a.count);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error)
        res.status(500).json({ message: '服务器错误!', stack: error.stack });
    }
  }
};

const getArticle = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;

    const article = await Article.findByIdAndUpdate(
      articleId,
      { $inc: { views: 1 } },
      { upsert: true },
    ).populate({ path: 'comments', populate: { path: 'user', model: 'User' } });

    if (article) {
      res.status(200).json(article);
    } else {
      res.status(404).json({ message: '找不到该文章!' });
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: '服务器错误!', stack: error.stack });
  }
};

const createArticle = async (req: Request, res: Response) => {
  const newArticle = new Article({
    title: `${req.body.title}`,
    content: '',
    tag: `${req.body.tag}`,
    likes: 0,
    views: 0,
    comments: [],
  });

  try {
    await newArticle.save();
    res.status(200).json(newArticle);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: '服务器错误!', stack: error.stack });
  }
};

const deleteArticle = async (req: Request, res: Response) => {
  const { user } = req;
  const { articleId } = req.params;

  if (user.role !== 'admin') res.status(401).json({ message: '权限不足!' });
  else {
    try {
      const article = await Article.findByIdAndRemove(articleId);
      if (!article) res.status(404).json({ message: '找不到该文章!' });
      else res.status(200).json({ message: '删除成功!' });
    } catch (error) {
      if (error instanceof Error)
        res.status(500).json({ message: '服务器错误!', stack: error.stack });
    }
  }
};

const updateArticle = async (req: Request, res: Response) => {
  const { user } = req;
  const { articleId } = req.params;
  const { addLikes, comment, content } = req.body;

  try {
    if (addLikes) {
      const updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        { $inc: { likes: 1 } },
        { upsert: true },
      ).populate({ path: 'comments', populate: { path: 'user', model: 'User' } });

      res.status(200).json(updatedArticle);
    }

    if (comment) {
      const newComment = new Comment({
        user: user.id,
        content: comment,
      });

      await newComment.save();

      const updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        {
          $push: {
            comments: {
              _id: newComment._id,
            },
          },
        },
        { safe: true, upsert: true },
      ).populate({ path: 'comments', populate: { path: 'user', model: 'User' } });

      res.status(200).json(updatedArticle);
    }

    if (content) {
      const updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        { content },
        { upsert: true },
      ).populate({ path: 'comments', populate: { path: 'user', model: 'User' } });

      res.status(200).json(updatedArticle);
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: '服务器错误!', stack: error.stack });
  }
};

export default { getArticles, createArticle, deleteArticle, updateArticle, getArticle };
