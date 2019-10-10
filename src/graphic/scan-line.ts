export interface ScanLine {
  y: number;
  x1: number;
  x2: number;
}

export function createScanLine(x1: number, x2: number, y: number): ScanLine {
  return {
    x1: Math.floor(x1),
    x2: Math.floor(x2),
    y: Math.floor(y)
  };
}
