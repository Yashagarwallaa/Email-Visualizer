import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const PreferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filters: { type: Object, default: {} },
  dateRange: { type: String, default: '' },
});

const dataSchema = new mongoose.Schema({
  Day: String,
  Age: String,
  Gender: String,
  A: Number,
  B: Number,
  C: Number,
  D: Number,
  E: Number,
  F: Number,
});

const User= mongoose.model('User', UserSchema);
const Preference= mongoose.model('Preference', PreferenceSchema);
const Data = mongoose.model('Data', dataSchema);
export {User,Preference,Data};

