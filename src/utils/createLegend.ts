import { Standing } from '../api';

export type Legend = Map<string, { color: string, positions: number[] }>;

export function createLegend(standings: Standing[], colors: string[], defaultColor: string) {
  const legend: Legend = new Map();
  standings.forEach(standing => {
    if (!standing.result) {
      return;
    }
    if (!legend.has(standing.result)) {
      legend.set(standing.result, { color: colors[legend.size] || defaultColor, positions: [standing.position] });
    } else {
      const entry = legend.get(standing.result)!;
      entry.positions[1] = standing.position;
      legend.set(standing.result, entry);
    }
  });

  return legend;
}
