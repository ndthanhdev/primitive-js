import { Context2D } from "@src/context-2d";
import { rndInt } from "@src/utils";
import { Shape, cloneCtx } from "@src/state";

export interface Triangle {
  kind: "Triangle";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  rgba: number[];
}

const MIN_DEVIATION = 32;

export function rndTriangle(w: number, h: number): Triangle {
  const x1 = rndInt(w);
  const y1 = rndInt(h);

  const x2 = x1 + rndInt(w) + MIN_DEVIATION;
  const y2 = y1 + rndInt(h) + MIN_DEVIATION;

  const x3 = x1 + rndInt(w) + MIN_DEVIATION;
  const y3 = y1 + rndInt(h) + MIN_DEVIATION;

  const rgba = [rndInt(255), rndInt(255), rndInt(255), Math.random()];

  return {
    kind: "Triangle",
    x1,
    y1,
    x2,
    y2,
    x3,
    y3,
    rgba
  };
}

export function rasterizeTriangle(
  triangle: Triangle,
  ctx: CanvasRenderingContext2D
): CanvasRenderingContext2D {
  const clone = cloneCtx(ctx);
  clone.fillStyle = `rbga(${triangle.rgba.join(",")})`;
  clone.beginPath();
  clone.moveTo(triangle.x1, triangle.y1);
  clone.lineTo(triangle.x2, triangle.y2);
  clone.lineTo(triangle.x3, triangle.y3);
  clone.fill();

  return clone;
}
