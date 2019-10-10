import {
  Triangle,
  rasterizeTriangle,
  rndTriangle,
  mutateTriangle
} from "@src/graphic/shapes/triangle";
import { ScanLine } from "@src/graphic/scan-line";

export type Shape = Triangle;

export function rndShape(w: number, h: number, kind: string): Shape {
  return rndTriangle(w, h);
}

export function rasterize(shape: Shape): ScanLine[] {
  return rasterizeTriangle(shape);
}

export function mutateShape(shape: Shape, w: number, h: number) {
  return mutateTriangle(shape, w, h);
}
