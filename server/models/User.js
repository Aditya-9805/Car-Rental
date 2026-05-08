import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

  firebaseUID: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },

  role: {
    type: String,
    enum: ['user', 'owner'],
    default: 'user',
  },

  image: {
    type: String,
    default: '',
  },

}, {
  timestamps: true
});

const User =
  mongoose.model(
    'User',
    userSchema
  );

export default User;