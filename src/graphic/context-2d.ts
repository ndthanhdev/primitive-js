import { Color } from "./color";

export interface Context2D {
  data: Uint8ClampedArray;
  w: number;
  h: number;
}

export function cloneContext2D(ctx: Context2D) {
  return {
    ...ctx,
    data: ctx.data.slice()
  };
}

export function createContext2D(
  w: number,
  h: number,
  dataOrBackGroundColor?: Uint8ClampedArray | Color
): Context2D {
  let theData: Uint8ClampedArray;

  if (dataOrBackGroundColor === undefined) {
    theData = new Uint8ClampedArray(w * h * 4);
  } else if (typeof (dataOrBackGroundColor as any).length === "number") {
    theData = new Uint8ClampedArray(
      (dataOrBackGroundColor as Uint8ClampedArray).slice()
    );
  } else {
    const color = dataOrBackGroundColor as Color;
    theData = new Uint8ClampedArray(w * h * 4);
    for (let i = 0; i < theData.length; i += 4) {
      theData[i] = color.r;
      theData[i + 1] = color.g;
      theData[i + 2] = color.b;
      theData[i + 3] = color.a;
    }
  }

  return {
    w,
    h,
    data: theData
  };
}

export function averageColor(ctx: Context2D): Color {
  const nPixels = ctx.w * ctx.h;
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;

  for (let i = 0; i < nPixels; i += 4) {
    r += ctx.data[i];
    g += ctx.data[i + 1];
    b += ctx.data[i + 2];
    a += ctx.data[i + 3];
  }

  r = r / nPixels;
  g = g / nPixels;
  b = b / nPixels;
  a = a / nPixels;

  return {
    r,
    g,
    b,
    a
  };
}
