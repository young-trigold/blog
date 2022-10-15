import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
  },
  { timestamps: true },
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
