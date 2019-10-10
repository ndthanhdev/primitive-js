import yargs from "yargs";
import { loadImage, createCanvas, createImageData } from "canvas";
import { createContext2D, gen, OutputFormat, Context2D } from "@src/index";
import { writeFileSync } from "fs";
import { rndTriangle } from "@src/graphic/shapes/triangle";
import { drawToMatch } from "@src/optimize";
import { rasterize } from "@src/graphic/shapes";
import { drawLines } from "@src/graphic/utils";

function toPng({ w, h, data }: Context2D) {
  const canvas = createCanvas(w, h);
  canvas.getContext("2d").putImageData(createImageData(data, w, h), 0, 0);
  return canvas.toBuffer();
}

yargs.command(
  ["gen", "* "].map(s => `${s} <input> <output>`),
  "",
  yargs => {
    yargs
      .positional("input", {
        type: "string"
      })
      .positional("output", {
        type: "string"
      });
  },
  args => {
    const [input, output] = [args.input as string, args.output as string];

    loadImage(input as string)
      .then(img => {
        console.log("loading");

        const ctx = createCanvas(img.width, img.height).getContext("2d");
        ctx.drawImage(img, 0, 0);
        console.log("loaded");

        return ctx;
      })
      .then(ctx => {
        console.log("climbing");
        const { width, height, data } = ctx.getImageData(
          0,
          0,
          ctx.canvas.width,
          ctx.canvas.height
        );

        const ctx2d = createContext2D(width, height, data);

        // const shape = rndTriangle(width, height);
        // const lines = rasterize({
        //   kind: "Triangle",
        //   x1: 100,
        //   y1: 100,
        //   x2: 500,
        //   y2: 0,
        //   x3: 300,
        //   y3: 500
        // });

        // const p = drawLines(ctx2d, { r: 255, g: 0, b: 0, a: 255 }, lines);

        // writeFileSync(output, toPng(p));
        // writeFileSync(
        //   `${output}.txt`,
        //   lines.map(l => `${l.x1},${l.x2},${l.y}`).join(",")
        // );
        const r = gen({
          target: ctx2d,
          noShape: 8
        });
        console.log("climbed");

        return r;
      })
      .then(rs => {
        console.log("writing");
        rs.map((r, i) => {
          writeFileSync(`output/${output}-${i}.png`, toPng(r.current));
          writeFileSync(`output/${output}-${i}.txt`, r.current.data.join(","));
        });

        console.log("wrote");
      })
      .catch(console.error);
  }
).argv;
