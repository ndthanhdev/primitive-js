import yargs from "yargs";
import { loadImage, createCanvas } from "canvas";
import { bestState, State } from "@src/index";
import { writeFileSync } from "fs";

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

        const state = new State(ctx);
        const best = bestState(state, 8);
        console.log("climbed");

        return best;
      })

      .then(state => {
        console.log("writing");
        console.log();
        writeFileSync(
          `${output as string}.json`,
          JSON.stringify(
            state.ctx.getImageData(0, 0, state.w, state.h).data.join(",")
          )
        );
        const canvas = createCanvas(state.w, state.h);
        canvas
          .getContext("2d")
          .putImageData(state.ctx.getImageData(0, 0, state.w, state.h), 0, 0);

        writeFileSync(output as string, canvas.toBuffer());

        console.log("wrote");
      })
      .then(console.log)
      .catch(console.error);
  }
).argv;
