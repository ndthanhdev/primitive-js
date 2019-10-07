import { Triangle, rasterizeTriangle, rndTriangle } from "@src/shapes/triangle";

export type Shape = Triangle;

export function rndShape(w: number, h: number, kind: string): Shape {
  return rndTriangle(w, h);
}

export function rasterize(shape: Shape, ctx: CanvasRenderingContext2D) {
  return rasterizeTriangle(shape, ctx);
}
