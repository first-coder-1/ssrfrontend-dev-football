import React from 'react';
import { PlayerRatingHistory } from '../../api';
import { interpolate } from '@/utils';

type Point = [number, number]

// The smoothing ratio
const smoothing = 0.2

/**
 * Properties of a line
 *
 * @param pointA [x,y]: coordinates
 * @param pointB [x,y]: coordinates
 * @return object  { length: l, angle: a }: properties of the line
 */
const line = (pointA: Point, pointB: Point) => {
  const lengthX = pointB[0] - pointA[0];
  const lengthY = pointB[1] - pointA[1];

  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  };
}

/**
 * Position of a control point
 *
 * @param current [x, y]: current point coordinates
 * @param previous [x, y]: previous point coordinates
 * @param next [x, y]: next point coordinates
 * @param reverse (boolean, optional): sets the direction
 * @return [number, number] [x,y]: a tuple of coordinates
 */
const controlPoint = (current: Point, previous: Point, next: Point, reverse?: boolean) => {
  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
  const p = previous || current;
  const n = next || current;
  // Properties of the opposed-line
  const o = line(p, n);
  // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0);
  const length = o.length * smoothing;
  // The control point position is relative to the current point
  const x = current[0] + Math.cos(angle) * length;
  const y = current[1] + Math.sin(angle) * length;

  return [x, y];
}

/**
 * Create the bezier curve command
 *
 * @param point [x,y]: current point coordinates
 * @param i index of 'point' in the array 'a'
 * @param a complete array of points coordinates
 * @return string 'C x2,y2 x1,y1 x,y': SVG cubic bezier C command
 */
const bezierCommand = (point: Point, i: number, a: Point[]) => {
  const start = controlPoint(a[i - 1], a[i - 2], point)
  const end = controlPoint(point, a[i - 1], a[i + 1], true)

  return `C ${start[0]},${start[1]} ${end[0]},${end[1]} ${point[0]},${point[1]}`
}

const height = 20;
const width = 100;

type Props = {
  history: PlayerRatingHistory[],
}

export function Line(props: Props): React.ReactElement | null {
  const { history } = props;
  if (history.length === 0) {
    return null;
  }
  let min = 10;
  let max = 0;
  history.forEach(item => {
    min = Math.min(min, item.rating);
    max = Math.max(max, item.rating);
  });
  const delta = max - min;
  const interpolator = interpolate(18, 2);
  const step = width / history.length;
  const points = history.map<[number, number]>((point, i) => [step / 2 + i * step, delta ? interpolator((point.rating - min) / delta) : max]);
  points.unshift([0, height / 2]);
  points.push([width, height / 2]);
  const d = points
    .reduce((acc, point, i, a) => i === 0
      ? `M ${point[0]},${point[1]}`
      : `${acc} ${bezierCommand(point, i, a)}`
      , '');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} version="1.1" xmlns="http://www.w3.org/2000/svg" className="svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FC7C5F"/>
          <stop offset="100%" stopColor="#6768DA"/>
        </linearGradient>
      </defs>
      <path d={d} stroke="url(#gradient)" strokeWidth="1px" fill="none"/>
    </svg>
  );
}
