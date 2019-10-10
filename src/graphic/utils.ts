import { Context2D } from "@src/graphic/context-2d";
import { Color } from "@src/graphic/color";
import { ScanLine } from "@src/graphic/scan-line";

export function drawLines(
  ctx: Context2D,
  color: Color,
  lines: ScanLine[]
): Context2D {
  const w = ctx.w;
  const data = ctx.data.slice();

  const sr = color.r;
  const sg = color.g;
  const sb = color.b;
  const sa = color.a;

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    const ma = sa / 255;
    const a = 1.0 - ma;

    for (let j = line.x1; j <= line.x2; ++j) {
      const o = (line.y * w + j) * 4;

      const dr = data[o + 0];
      const dg = data[o + 1];
      const db = data[o + 2];

      data[o + 0] = (dr * a + sr * ma) | 0;
      data[o + 1] = (dg * a + sg * ma) | 0;
      data[o + 2] = (db * a + sb * ma) | 0;
    }
  }

  return {
    ...ctx,
    data
  };
}

export function computeColor(
  target: Context2D,
  current: Context2D,
  lines: ScanLine[],
  alpha: number
): Color {
  const width = target.w;
  const dataT = target.data;
  const dataC = current.data;

  const a = 255.0 / alpha;

  let count = 0;
  let r = 0.0;
  let g = 0.0;
  let b = 0.0;

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];

    for (let j = line.x1; j <= line.x2; ++j) {
      const o = (line.y * width + j) * 4;

      const tr = dataT[o + 0];
      const tg = dataT[o + 1];
      const tb = dataT[o + 2];

      const cr = dataC[o + 0];
      const cg = dataC[o + 1];
      const cb = dataC[o + 2];

      r += (tr - cr) * a + cr;
      g += (tg - cg) * a + cg;
      b += (tb - cb) * a + cb;

      ++count;
    }
  }

  if (count > 0) {
    r = Math.max(0, Math.min(255, r / count)) | 0;
    g = Math.max(0, Math.min(255, g / count)) | 0;
    b = Math.max(0, Math.min(255, b / count)) | 0;
  }

  return { r, g, b, a: alpha };
}
