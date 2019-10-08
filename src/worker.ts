import { Climber } from "@src/optimize";
import { State, Shape, cloneCtx } from "@src/state";
import { rasterize, rndShape } from "@src/shapes";

interface Worker {
  state: State;
  target: State;
}

function createWorker(target: State) {
  const state = new State(target.w, target.h);
  state.ctx.fillStyle = `rgba(255,255,255,1)`;
  state.ctx.fillRect(0, 0, target.w, target.h);
  return { state, target: target.clone() };
}

function cloneWorker(worker: Worker): Worker {
  return {
    target: worker.target,
    state: worker.state.clone()
  };
}

function getData(state: State) {
  return state.ctx.getImageData(0, 0, state.w, state.h).data;
}

function getDeviation(target: State, forecast: State) {
  const t = getData(target);
  const f = getData(forecast);
  const n = t.length;

  let e = 0;

  for (let i = 0; i < n; i += 4) {
    e += Math.pow(t[i] - f[i], 2);
    e += Math.pow(t[i + 1] - f[i + 1], 2);
    e += Math.pow(t[i + 2] - f[i + 2], 2);
    e += Math.pow(t[i + 3] - f[i + 3], 2);
  }

  return Math.sqrt(e / n);
}

function move(state: State) {
  const s = rndShape(state.w, state.h, "triangle");
  const r = state.addShape(s);

  return r;
}

function hillClimbing(worker: Worker, maxAge: number = 1000) {
  const clone = cloneWorker(worker);
  let best = move(clone.state);
  let bestD = getDeviation(clone.target, best);
  let step = 0;
  for (let age = 0; age < maxAge; age++) {
    const candidate = move(clone.state);
    const candidateD = getDeviation(clone.target, candidate);
    if (bestD > candidateD) {
      best = candidate;
      bestD = candidateD;
      age = -1;
    }
    step++;
  }

  return best;
}

export function bestState(target: State, noShape: number) {
  const worker = createWorker(target);

  console.log(`[0/${noShape}]`);
  for (let i = 0; i < noShape; i++) {
    worker.state = hillClimbing(worker);
    console.log(`[${i + 1}/${noShape}]`);
  }

  return worker.state;
}
