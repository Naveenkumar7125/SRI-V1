// /models/subschemas/otherCaseDetails.js
import mongoose from 'mongoose';

export const otherCaseDetailsSchema = new mongoose.Schema({
  natureOfIncident: String,
  operationalNotes: String
}, { versionKey: false });
