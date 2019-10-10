import { Context2D } from "@src/graphic/context-2d";
import { createModel, step, Model } from "@src/model";

export enum OutputFormat {
  png = "png"
}

interface Option {
  target: Context2D;
  noShape: number;
}

export function gen(opt: Option): Model[] {
  const { target, noShape } = opt;

  const stack = [createModel(target)];

  for (let index = 0; index < noShape; index++) {
    console.log(`${index+1}/${noShape}`);
    const next = step(stack[index]);
    stack.push(next);
  }

  return stack;
}
