import mongoose from 'mongoose';

const { Schema } = mongoose;

const noteScheme = new Schema(
  {
    title: {
      type: String,
      required: [true, '请添加笔记标题'],
    },
    sortedIndex: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} 不是一个整数',
      },
    },
    chapters: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Chapter',
      },
    ],
  },
  { timestamps: true },
);

const Note = mongoose.model('Note', noteScheme);

export default Note;
