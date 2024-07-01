export function commarize(num: number) {
  if (num > 999 && num < 1000000) {
    return (num/1000).toFixed(1) + 'K';
  } else if (num >= 1000000) {
    return (num/1000000).toFixed(1) + 'M';
  } else {
    return num.toFixed(1);
  }
}

export function uncommarize(str: string) {
  const float = parseFloat(str);
  if (str.includes('K')) {
    return float * 1000;
  } else if (str.includes('M')) {
    return float * 1000000;
  } else {
    return float;
  }
}

export function sum(numbers: number[]) {
  return numbers.reduce((sum, num) => sum + num, 0);
}
