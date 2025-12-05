// /models/Case.js
import mongoose from 'mongoose';
import { videoAnalyticsSchema as _videoAnalyticsSchema } from './subschemas/videoAnalytics.js';
import { faceRecognitionSchema as _faceRecognitionSchema } from './subschemas/faceRecognition.js';
import { otherCaseDetailsSchema as _otherCaseDetailsSchema } from './subschemas/otherCaseDetails.js';
import { caseEvidenceSchema as _caseEvidenceSchema } from './subschemas/caseEvidence.js';
import { firSchema as _firSchema } from './subschemas/fir.js';

// If you prefer standalone file without subschemas, scroll further below (I included subschema files separately).
// But here we'll use the imported subschemas to keep file-size readable and reusable.

const caseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  caseType: { 
    type: String, 
    enum: ['Face Recognition', 'Intrusion Detection', 'Object Detection', 'Vehicle Analytics', 'Other'],
    default: 'Other'
  },
  threatLevel: { 
    type: String, 
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    default: 'Moderate'
  },
  priority: { 
    type: String, 
    enum: ['Routine', 'Elevated', 'Critical'],
    default: 'Routine'
  },
  status: { 
    type: String, 
    enum: ['New', 'Under Investigation', 'Ongoing', 'Completed', 'FIR Filed - Legal Action Started'],
    default: 'Under Investigation'
  },
  team: { type: String, required: true },
  nsgHub: { type: String, required: true },
  operationCategory: { 
    type: String, 
    enum: ['Counter-Terror', 'VIP Security', 'Critical Infrastructure', 'Airport Security', 'Urban Counter-Insurgency'],
    default: 'Counter-Terror'
  },
  location: { type: String, required: true },
  zoneClassification: { 
    type: String, 
    enum: ['Red', 'Amber', 'Green'],
    default: 'Amber'
  },
  incidentTime: { type: Date, required: true },
  firstDetectionTime: { type: Date },
  firstResponseTime: { type: Date },
  expectedClosureWindow: { type: String },
  groundCommander: { type: String },
  controlRoomContact: { type: String },
  engagementPhase: { 
    type: String, 
    enum: ['Pre-incident Intel', 'Live Incident', 'Post-incident Review'],
    default: 'Live Incident'
  },
  escalationLevel: { 
    type: String, 
    enum: ['Local Command', 'State Coordination', 'MHA / Central Stakeholder'],
    default: 'Local Command'
  },
  linkedOperationId: { type: String },
  assignedOfficer: { type: String, default: 'Unassigned NSG Operative' },
  videoAnalytics: { type: _videoAnalyticsSchema },
  faceRecognition: { type: _faceRecognitionSchema },
  otherCaseDetails: { type: _otherCaseDetailsSchema },
  evidence: [ _caseEvidenceSchema ],
  evidenceCount: { type: Number, default: 0 },
  fir: _firSchema,
  evidenceSummary: String,
  roeNotes: String,
  immediateDirectives: String,
  createdOn: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
}, { versionKey: false });

// Indexes from original
caseSchema.index({ status: 1 });
caseSchema.index({ threatLevel: 1 });
caseSchema.index({ team: 1 });
caseSchema.index({ createdOn: -1 });

// Export schema for reuse if needed
export { caseSchema };

// Factory to create model bound to a specific mongoose connection (NSG DB)
export default function createCaseModel(connection) {
  try {
    return connection.model('Case');
  } catch (e) {
    return connection.model('Case', caseSchema, 'cases');
  }
}
