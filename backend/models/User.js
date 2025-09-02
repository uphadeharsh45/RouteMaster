const mongoose = require('mongoose')
const { Schema } = mongoose;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  mobile: String,
  date: {
    type: Date,
    default: Date.now
  },
  image: String,
  gender: String,
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  waitTime: String,
});

const User = mongoose.model('user', UserSchema);
module.exports = User