import mongoose from 'mongoose';

const { Schema } = mongoose;

const articleScheme = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    tag: {
      type: String,
      required: true,
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
