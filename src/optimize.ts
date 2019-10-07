export interface Climber {
  getDeviation: () => number;
  moveRnd: () => Climber;
  clone: () => Climber;
}

export function HillClimbing(climber: Climber, maxAge: number): Climber {
  let state = climber.clone();
  let energy = state.getDeviation();

  for (let age = 0; age < maxAge; age++) {
    const candidate = state.moveRnd();
    if (energy > candidate.getDeviation()) {
      state = state;
      energy = energy;
      age = -1;
    }
  }

  return state;
}
