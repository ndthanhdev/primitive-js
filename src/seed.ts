import { Context2D } from "@src/graphic/context-2d";
import { Shape, rndShape, rasterize } from "@src/graphic/shapes";
import { computeColor, drawLines } from "@src/graphic/utils";
import { drawToMatch, getDifference } from "@src/optimize";
import { Color } from "./graphic/color";

export interface Seed {
  ctx: Context2D;
  shape: Shape;
  energy: number;
}

export function rndSeed(target: Context2D, current: Context2D): Seed {
  const shape = rndShape(target.w, target.h, "triangle");
  const [ctx, _] = drawToMatch(target, current, shape);
  const energy = getDifference(target, ctx);

  return {
    ctx,
    energy,
    shape
  };
}

export function bestRndSeed(
  target: Context2D,
  current: Context2D,
  noSeed: number = 8
) {
  let best = rndSeed(target, current);

  for (let i = 0; i < noSeed - 1; i++) {
    let seed = rndSeed(target, current);

    if (best.energy > seed.energy) {
      best = seed;
    }
  }

  return best;
}
