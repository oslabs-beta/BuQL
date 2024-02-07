import mongoose from 'mongoose';

// connect to mongoose
const ObjectId = mongoose.Types.ObjectId;

const uri = Bun.env.MONGO;

mongoose.connect(uri).then(() => console.log('DB connected.'));

// define schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// export schema
export const User = mongoose.model('User', userSchema, 'user');
