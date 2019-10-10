import { int } from "random";
import { nativeMath, integer, browserCrypto } from "random-js";

export function coordinateToIndex(x: number, y: number) {
  return x * y * 4 + y * 4;
}

export function clamp(value: number, low: number, high: number) {
  return Math.max(low, Math.min(high, value));
}

export function clampCoordinate(coor: number[], wh: number[]) {
  const [x, y] = coor;
  const [w, h] = wh;

  const rX = clamp(x, 0, w - 1);
  const rY = clamp(x, 0, h - 1);

  return [rX, rY];
}

export function rndInt(minOrMax: number, max?: number) {
  let theMin: number;
  let theMax: number;
  if (max === undefined) {
    theMin = 0;
    theMax = minOrMax;
  } else {
    theMin = minOrMax;
    theMax = max as number;
  }
  return Math.floor(Math.random() * (theMax - theMin + 1)) + theMin;
  // return integer(theMin, theMax)(browserCrypto);
}

export const IsNodeEnv: boolean =
  // @ts-ignore
  typeof module !== "undefined" && module.exports;
