export function score(score?: string) {
  return (score || '').split('').join(' ');
}
