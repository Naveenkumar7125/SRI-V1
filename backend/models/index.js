// /models/index.js
// Initialize models with given mongoose connections
import createEvidenceModel from './Evidence.js';
import createCaseModel from './Case.js';
import createLiveAlertModel from './LiveAlert.js';

export default function initModels({ sriConn, nsgConn }) {
  if (!sriConn || !nsgConn) {
    throw new Error('Both sriConn and nsgConn mongoose connections are required to initialize models.');
  }

  const Evidence = createEvidenceModel(sriConn);
  const LiveAlert = createLiveAlertModel(sriConn);
  const Case = createCaseModel(nsgConn);

  return { Evidence, Case, LiveAlert };
}
