import mongoose from 'mongoose';

// connect to mongoose
const uri = Bun.env.MONGO;

await mongoose.connect(uri).then(() => console.log('DB connected.'));

// define schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  birthdate: Date,
  registeredAt: Date,
});

// export schema
export const User = mongoose.model('User', userSchema, 'user');
