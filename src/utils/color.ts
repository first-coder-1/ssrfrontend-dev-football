export function invertHexColor(hex: string) {
  return `#${(Number(`0x1${hex.substr(1)}`) ^ 0xFFFFFF).toString(16).substr(1)}`;
}
