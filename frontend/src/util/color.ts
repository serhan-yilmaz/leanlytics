export function darken(hex: string, amount = 20) {
  const num = parseInt(hex.replace('#', ''), 16)

  let r = (num >> 16) - amount
  let g = ((num >> 8) & 0x00ff) - amount
  let b = (num & 0x0000ff) - amount

  r = Math.max(Math.min(255, r), 0)
  g = Math.max(Math.min(255, g), 0)
  b = Math.max(Math.min(255, b), 0)

  return `rgb(${r}, ${g}, ${b})`
}