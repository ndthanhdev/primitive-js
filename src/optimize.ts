import { Shape, mutateShape } from "@src/graphic/shapes";
import { Context2D } from "@src/graphic/context-2d";
import { drawLines, computeColor } from "@src/graphic/utils";
import { rasterize } from "@src/graphic/shapes";
import { Color } from "./graphic/color";

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

export function getDifference(target: Context2D, forecast: Context2D) {
  const t = target.data;
  const f = forecast.data;
  const n = t.length;

  let e = 0;

  for (let i = 0; i < n; i += 4) {
    e += Math.pow(t[i] - f[i], 2);
    e += Math.pow(t[i + 1] - f[i + 1], 2);
    e += Math.pow(t[i + 2] - f[i + 2], 2);
    e += Math.pow(t[i + 3] - f[i + 3], 2);
  }

  return Math.sqrt(e / n);
}

export function drawToMatch(
  target: Context2D,
  ctx: Context2D,
  shape: Shape
): [Context2D, Color] {
  const alpha = 128; // TODO: convert alpha to params
  const lines = rasterize(shape);
  const color = computeColor(target, ctx, lines, alpha);

  return [drawLines(ctx, color, lines), color];
}

interface HillClimbInput<T> {
  state: T;
  getEnergy: (arg1: T) => number;
  mutate: (arg1: T) => T;
  maxAge?: number;
}

export function hillClimb<T>(input: HillClimbInput<T>): T {
  const { state, getEnergy, mutate, maxAge = 100 } = input;

  let best = state;
  let bestE = getEnergy(state);

  for (let age = 0; age < maxAge; age++) {
    const candidate = mutate(best);
    const candidateE = getEnergy(candidate);
    if (bestE > candidateE) {
      best = candidate;
      bestE = candidateE;
      age = -1;
    }
  }

  return best;
}
