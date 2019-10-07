export function coordinateToIndex(x: number, y: number) {
  return x * y * 4 + y * 4;
}

export function clampCoordinate(coor: number[], wh: number[]) {
  const [x, y] = coor;
  const [w, h] = wh;

  const rX = Math.max(0, Math.min(w - 1, x));
  const rY = Math.max(0, Math.min(h - 1, y));

  return [rX, rY];
}

export function rndInt(minOrMax: number, max?: number) {
  let theMin: number;
  let theMax: number;
  if (typeof max === undefined) {
    theMin = 0;
    theMax = minOrMax;
  } else {
    theMin = minOrMax;
    theMax = max as number;
  }
  return Math.floor(Math.random() * (theMax - theMin + 1)) + theMin;
}

export const IsNodeEnv: boolean =
  // @ts-ignore
  typeof module !== "undefined" && module.exports;
