import {
  Context2D,
  createContext2D,
  averageColor,
  cloneContext2D
} from "@src/graphic/context-2d";
import { Color } from "@src/graphic/color";
import { Shape, rasterize, rndShape, mutateShape } from "@src/graphic/shapes";
import { ScanLine } from "@src/graphic/scan-line";
import { drawLines, computeColor } from "@src/graphic/utils";
import { bestRndSeed, Seed } from "@src/seed";
import { hillClimb, getDifference, drawToMatch } from "@src/optimize";

export interface Model {
  target: Context2D;
  current: Context2D;

  shapes: Shape[];
  colors: Color[];
}

export function cloneModel(model: Model): Model {
  return {
    ...model,
    current: cloneContext2D(model.current),
    shapes: model.shapes.slice(),
    colors: model.colors.slice()
  };
}

export function createModel(target: Context2D): Model {
  const bgColor = averageColor(target);
  const current = createContext2D(target.w, target.h, { ...bgColor, a: 255 });
  const shapes: Shape[] = [];
  const colors: Color[] = [];

  return { target, current, shapes, colors };
}

export function addShape(model: Model, shape: Shape, alpha: number) {
  const lines = rasterize(shape);
  const color = computeColor(model.target, model.current, lines, alpha);
  const clone = cloneModel(model);

  clone.current = drawLines(clone.current, color, lines);
  clone.shapes.push(shape);
  clone.colors.push(color);

  return clone;
}

interface State {
  ctx: Context2D;
  shape: Shape;
}

function createGetEnergy(target: Context2D) {
  return (state: State) => getDifference(target, state.ctx);
}

function createMutate(model: Model) {
  return (state: State): State => {
    const shape = mutateShape(state.shape, state.ctx.w, state.ctx.h);
    const [ctx, color] = drawToMatch(model.target, model.current, shape);

    return {
      ctx,
      shape
    };
  };
}

export function step(model: Model): Model {
  const clone = cloneModel(model);

  const seed = bestRndSeed(model.target, model.current);

  const best = hillClimb<State>({
    state: seed,
    getEnergy: createGetEnergy(model.target),
    mutate: createMutate(model)
  });

  const [ctx, color] = drawToMatch(clone.target, clone.current, best.shape);

  clone.current = ctx;
  clone.shapes.push(best.shape);
  clone.colors.push(color);

  return clone;
}

function toSvg(shapes: Shape, colors: Color) {}
