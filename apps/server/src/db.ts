import mongoose from 'mongoose';

const { log } = console;

const connectingToDB = () => {
  const dbUrl = 'mongodb://8.130.16.29:27017';

  const options = {
    dbName: 'blog',
    user: 'trigold',
    pass: process.env.DBPass,
    authSource: 'admin',
  };

  mongoose
    .connect(dbUrl, options)
    .then(() => log('数据库连接成功!'))
    .catch(() => log('数据库连接错误!'));
};

export default connectingToDB;
