import mongoose from 'mongoose';

const { Schema } = mongoose;

const articleScheme = new Schema(
  {
    title: {
      type: String,
      required: [true, '请添加文章标题'],
    },
    content: {
      type: String,
    },
    tag: {
      type: String,
      required: [true, '请添加文章标签'],
    },
    likes: Number,
    views: Number,
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Article = mongoose.model('Article', articleScheme);

export default Article;
