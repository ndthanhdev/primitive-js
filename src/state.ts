import { IsNodeEnv } from "@src/utils";
import { Triangle, rasterizeTriangle } from "@src/shapes/triangle";

export type Shape = Triangle;

export function createCanvas(w: number, h: number): HTMLCanvasElement {
  if (IsNodeEnv) {
    const canvas = require("canvas");
    return canvas.createCanvas(w, h);
  } else {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    return canvas;
  }
}

export function createContext2D(w: number, h: number) {
  return createCanvas(w, h).getContext("2d") as CanvasRenderingContext2D;
}

const rasterizeMap = {
  Triangle: rasterizeTriangle
};

function rasterizeShape(shape: Shape, ctx: CanvasRenderingContext2D) {
  return rasterizeMap[shape.kind](shape, ctx);
}

export function cloneCtx(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas;

  const clone = createContext2D(width, height);

  clone.putImageData(ctx.getImageData(0, 0, width, height), 0, 0);

  return clone;
}

export class State {
  shapeStack: Shape[] = [];
  ctx: CanvasRenderingContext2D;

  constructor(
    public readonly widthOrContext: number | CanvasRenderingContext2D,
    public readonly height?: number
  ) {
    if (typeof widthOrContext === "number") {
      if (typeof height === "number") {
        this.ctx = createContext2D(widthOrContext, height);
      } else {
        throw "height must be a number";
      }
    } else {
      this.ctx = widthOrContext;
    }
  }

  get h() {
    return this.ctx.canvas.height;
  }

  get w() {
    return this.ctx.canvas.width;
  }

  addShape(shape: Shape): State {
    const clone = this.clone();

    clone.shapeStack.push(shape);
    clone.ctx = rasterizeShape(shape, clone.ctx);

    return clone;
  }

  clone(): State {
    const clone = new State(cloneCtx(this.ctx));
    clone.shapeStack = this.shapeStack.slice();
    return this;
  }
}
