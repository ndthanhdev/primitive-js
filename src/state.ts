import { Climber } from "@src/optimize";

export interface Pixel {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface Step {}

class State implements Climber<Step> {
  getEnergy() {
    return 1;
  }

  move: () => Step;
  undo: (arg1: Step) => any;
  copy: () => Climber<Step>;
}
