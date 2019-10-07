export interface Climber<T> {
  getEnergy: () => number;
  move: () => T;
  undo: (arg1: T) => any;
  copy: () => Climber<T>;
}

export function HillClimbing<T>(
  climber: Climber<T>,
  maxAge: number
): Climber<T> {
  let state = climber.copy();
  let bestState = state.copy();
  let bestEnergy = state.getEnergy();
  let step = 0;

  for (let age = 0; age < maxAge; age++) {
    const undo = state.move();
    const energy = state.getEnergy();
    if (energy > bestEnergy) {
      state.undo(undo);
    } else {
      bestEnergy = energy;
      bestState = state;
      age = -1;
    }
    step++;
  }

  return bestState;
}
