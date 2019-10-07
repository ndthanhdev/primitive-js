import yargs from "yargs";
import { loadImage, createCanvas } from "canvas";
import { Pixel } from "@src/index";

const decode = (path: string) =>
  loadImage(path)
    .then(img => {
      const ctx = createCanvas(img.width, img.height).getContext("2d");
      ctx.drawImage(img, 0, 0);
      return ctx;
    })
    .then(data => {});

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
    const { input, output } = args;

    loadImage(input)
      .then(img => {
        const ctx = createCanvas(img.width, img.height).getContext("2d");
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, img.width, img.height);
      })
      .then(console.log)
      .catch(console.error);
  }
).argv;
