export function stateSummary(state) {
  return {
    day: state.day,
    month: state.month,
    year: state.year,
    season: state.season,
    crew: state.crew,
    food: state.food,
    squeal: state.squeal,
    wear: state.wear,
    morale: state.morale,
    node: state.node,
    segmentDay: state.segmentDay,
    over: state.over,
    won: state.won,
    score: state.score,
    pendingEvent: state.pendingEvent,
    pendingSettlement: state.pendingSettlement,
  };
}
