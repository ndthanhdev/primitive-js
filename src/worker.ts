import { Climber } from "@src/optimize";
import { State, Shape, cloneCtx } from "@src/state";
import { rasterize, rndShape } from "@src/shapes";

interface Worker {
  state: State;
  target: State;
}

function createWorker(target: State) {
  const state = new State(target.w, target.h);
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

function getDeviation(worker: Worker) {
  const t = getData(worker.target);
  const f = getData(worker.state);
  const n = t.length;

  let e = 0;

  for (let i = 0; i < n; i += 4) {
    e += Math.pow(t[i] - f[i], 2);
    e += Math.pow(t[i + 1] - f[i + 1], 2);
    e += Math.pow(t[i + 2] - f[i + 2], 2);
    e += Math.pow((t[i + 3] - f[i + 3]) * 255, 2);
  }

  return Math.sqrt(e / n);
}

function move(worker: Worker) {
  const clone = cloneWorker(worker);
  const s = rndShape(clone.state.w, clone.state.h, "triangle");
  clone.state.addShape(s);
  return clone;
}

function hillClimbing(worker: Worker, maxAge: number = 100) {
  const state = cloneWorker(worker);
  let best = move(state);
  let bestE = getDeviation(worker);
  let step = 0;
  for (let age = 0; age < maxAge; age++) {
    const candidate = move(state);
    const candidateE = getDeviation(candidate);
    if (bestE > candidateE) {
      best = candidate;
      bestE = candidateE;
      age = -1;
    }
    step++;
  }

  return best;
}

export function best(target: State, noShape: number) {
  let worker = createWorker(target);
  for (let i = 0; i < noShape; i++) {
    worker = hillClimbing(worker);
  }

  return worker;
}
