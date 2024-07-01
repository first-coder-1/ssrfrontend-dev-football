export function interpolate(a: number, b: number) {
  return function (t: number) {
    return a * (1 - t) + b * t;
  };
}
