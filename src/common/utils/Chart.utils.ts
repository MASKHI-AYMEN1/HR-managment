export function generateColors(num: number) {
  const baseColor = { r: 28, g: 161, b: 239 }
  const colors = []
  for (let i = 0; i < num; i++) {
    const r = Math.min(
      255,
      Math.max(0, baseColor.r + (Math.random() * 60 - 30))
    )
    const g = Math.min(
      255,
      Math.max(0, baseColor.g + (Math.random() * 60 - 30))
    )
    const b = Math.min(
      255,
      Math.max(0, baseColor.b + (Math.random() * 60 - 30))
    )
    colors.push(
      `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, 0.9)`
    )
  }

  return colors
}
