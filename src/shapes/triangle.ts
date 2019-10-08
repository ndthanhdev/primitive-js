import { Context2D } from "@src/context-2d";
import { rndInt } from "@src/utils";
import { Shape, cloneCtx } from "@src/state";
import { clampCoordinate } from "@src/utils";

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

const MIN_DEVIATION = 4;

export function rndTriangle(w: number, h: number): Triangle {
  const [x1, y1] = [rndInt(w), rndInt(h)];

  const [x2, y2] = clampCoordinate(
    [x1 + rndInt(w) + MIN_DEVIATION, y1 + rndInt(h) + MIN_DEVIATION],
    [w, h]
  );

  const [x3, y3] = clampCoordinate(
    [x1 + rndInt(w) + MIN_DEVIATION, y1 + rndInt(h) + MIN_DEVIATION],
    [w, h]
  );

  const rgba = [rndInt(255), rndInt(255), rndInt(255), rndInt(255)];

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

function rgbaToFillStyle(rgba: number[]) {
  const rgb = rgba.slice(0, 3);
  const a = rgba.slice(3, 4)[0] / 255;

  return `rgba(${[...rgb, a].join(",")})`;
}

export function rasterizeTriangle(
  triangle: Triangle,
  ctx: CanvasRenderingContext2D
): CanvasRenderingContext2D {
  const clone = cloneCtx(ctx);
  clone.fillStyle = rgbaToFillStyle(triangle.rgba);
  clone.beginPath();
  clone.moveTo(triangle.x1, triangle.y1);
  clone.lineTo(triangle.x2, triangle.y2);
  clone.lineTo(triangle.x3, triangle.y3);
  clone.fill();

  return clone;
}
