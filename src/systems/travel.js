import { NODES } from '../data/nodes.js';

export function locationSummary(state) {
  const current = NODES[state.node];
  const next = NODES[state.node + 1] || null;
  return {
    current,
    next,
    segmentDay: state.segmentDay,
    segmentDist: next ? next.dist : 0,
  };
}
