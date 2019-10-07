import { coordinateToIndex } from "@src/utils";

export class Context2D {
  private _data: number[];

  constructor(
    public readonly w: number,
    public readonly h: number,
    data?: number[]
  ) {
    if (typeof data !== undefined) {
      this._data = data as number[];
    } else {
      this._data = ([] as number[]).fill(0, 0, this.w * this.h * 4);
    }
  }

  get data(): number[] {
    return this._data;
  }

  getPixel(x: number, y: number): number[] {
    const index = coordinateToIndex(x, y);
    return this.data.slice(index, 4);
  }

  putPixel(x: number, y: number, pixel: number[]): Context2D {
    const index = coordinateToIndex(x, y);
    const data = this.data.splice(index, 0, ...pixel);
    return new Context2D(this.w, this.h, data);
  }

  clone() {
    return new Context2D(this.w, this.h, this.data.slice());
  }
}



