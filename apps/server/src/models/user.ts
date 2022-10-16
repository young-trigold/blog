import mongoose from 'mongoose';

const { Schema } = mongoose;

const userScheme = new Schema(
  {
    name: String,
    avatar: String,
    pwd: String,
    role: String,
    introduction: String,
    email: String,
  },
  { timestamps: true },
);

const User = mongoose.model('User', userScheme);

export default User;
