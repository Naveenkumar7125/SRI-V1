// /models/subschemas/fir.js
import mongoose from 'mongoose';

export const firSchema = new mongoose.Schema({
  number: { type: String, required: true },
  filedBy: { type: String, required: true },
  date: { type: String, required: true },
  witness: { type: String },
  note: { type: String }
}, { versionKey: false });
