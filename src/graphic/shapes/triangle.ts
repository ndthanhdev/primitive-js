import { rndInt, clamp } from "@src/utils";
import { clampCoordinate } from "@src/utils";
import { ScanLine, createScanLine } from "@src/graphic/scan-line";

export interface Triangle {
  kind: "Triangle";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
}

const MIN_DEVIATION = 4;

export function createTriangle(t: Omit<Triangle, "kind">): Triangle {
  return {
    kind: "Triangle",
    ...t
  };
}

export function rndTriangle(w: number, h: number): Triangle {
  const [x1, y1] = clampCoordinate(
    [rndInt(w) - MIN_DEVIATION, rndInt(h) - MIN_DEVIATION],
    [w, h]
  );

  const [x2, y2] = clampCoordinate(
    [x1 + rndInt(w) + MIN_DEVIATION, y1 + rndInt(h) + MIN_DEVIATION],
    [w, h]
  );

  const [x3, y3] = clampCoordinate(
    [x1 + rndInt(w) + MIN_DEVIATION, y1 + rndInt(h) + MIN_DEVIATION],
    [w, h]
  );

  return createTriangle({
    x1,
    y1,
    x2,
    y2,
    x3,
    y3
  });
}

function rgbaToFillStyle(rgba: number[]) {
  const rgb = rgba.slice(0, 3);
  const a = rgba.slice(3, 4)[0] / 255;

  return `rgba(${[...rgb, a].join(",")})`;
}

function degrees(radians: number) {
  return (180 * radians) / Math.PI;
}

function isValid(t: Triangle) {
  const minDegrees = 15;

  let a1, a2, a3;
  {
    let x1 = t.x2 - t.x1;
    let y1 = t.y2 - t.y1;
    let x2 = t.x3 - t.x1;
    let y2 = t.y3 - t.y1;
    const d1 = Math.sqrt(x1 * x1 + y1 * y1);
    const d2 = Math.sqrt(x2 * x2 + y2 * y2);
    x1 /= d1;
    y1 /= d1;
    x2 /= d2;
    y2 /= d2;
    a1 = degrees(Math.acos(x1 * x2 + y1 * y2));
  }

  {
    let x1 = t.x1 - t.x2;
    let y1 = t.y1 - t.y2;
    let x2 = t.x3 - t.x2;
    let y2 = t.y3 - t.y2;
    const d1 = Math.sqrt(x1 * x1 + y1 * y1);
    const d2 = Math.sqrt(x2 * x2 + y2 * y2);
    x1 /= d1;
    y1 /= d1;
    x2 /= d2;
    y2 /= d2;
    a2 = degrees(Math.acos(x1 * x2 + y1 * y2));
  }

  a3 = 180 - a1 - a2;
  return a1 > minDegrees && a2 > minDegrees && a3 > minDegrees;
}

export function mutateTriangle(triangle: Triangle, w: number, h: number) {
  const m = 16;
  let t = createTriangle({ ...triangle });

  while (true) {
    switch (rndInt(2)) {
      case 0:
        t.x1 = clamp(t.x1 + rndInt(-m, m), 0, w);
        t.y1 = clamp(t.y1 + rndInt(-m, m), 0, h);
        break;

      case 1:
        t.x2 = clamp(t.x2 + rndInt(-m, m), 0, w);
        t.y2 = clamp(t.y2 + rndInt(-m, m), 0, h);
        break;

      case 2:
        t.x3 = clamp(t.x3 + rndInt(-m, m), 0, w);
        t.y3 = clamp(t.y3 + rndInt(-m, m), 0, h);
        break;
    }

    if (isValid(t)) {
      return t;
    }
  }
}

function sortTriangleVertexesByY(triangle: Triangle): Triangle {
  let { x1, x2, x3, y1, y2, y3 } = triangle;

  const vertexes = [[x1, y1], [x2, y2], [x3, y3]];

  [[x1, y1], [x2, y2], [x3, y3]] = vertexes.sort((a, b) => a[1] - b[1]);

  return {
    kind: "Triangle",
    x1,
    y1,
    x2,
    y2,
    x3,
    y3
  };
}

export function rasterizeTriangle(triangle: Triangle): ScanLine[] {
  const t = sortTriangleVertexesByY(triangle);

  const { x1, x2, x3, y1, y2, y3 } = t;

  if (y2 === y3) {
    return rasterizeBottom(t);
  } else if (y1 === y2) {
    return rasterizeTop(t);
  } else {
    const x4 = (x1 + ((y2 - y1) / (y3 - y1)) * (x3 - x1)) | 0;
    const y4 = y2;

    const r: ScanLine[] = [
      ...rasterizeBottom({
        ...t,
        x3: x4,
        y3: y4
      }),
      ...rasterizeTop(
        createTriangle({
          x1: x2,
          y1: y2,
          x2: x4,
          y2: y4,
          x3,
          y3
        })
      )
    ];

    return r;
  }
}

function rasterizeBottom(t: Triangle) {
  const lines = [];

  const { x1, x2, x3, y1, y2, y3 } = t;

  const s1 = (x2 - x1) / (y2 - y1);
  const s2 = (x3 - x1) / (y3 - y1);
  let ax = x1;
  let bx = x1;

  for (let y = y1; y <= y2; ++y) {
    const a = ax;
    const b = bx;

    ax += s1;
    bx += s2;

    lines.push(createScanLine(a, b, y));
  }

  return lines;
}

function rasterizeTop(t: Triangle) {
  const lines = [];
  const { x1, x2, x3, y1, y2, y3 } = t;

  const s1 = (x3 - x1) / (y3 - y1);
  const s2 = (x3 - x2) / (y3 - y2);
  let ax = x3;
  let bx = x3;

  for (let y = y3; y >= y1; y--) {
    ax -= s1;
    bx -= s2;

    lines.push(createScanLine(ax, bx, y));
  }

  return lines;
}
