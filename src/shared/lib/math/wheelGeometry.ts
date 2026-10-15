export function calculateSegmentAngles(index: number, total: number) {
  const anglePerSegment = 360 / total;
  const startAngle = index * anglePerSegment;
  const endAngle = (index + 1) * anglePerSegment;
  return { anglePerSegment, startAngle, endAngle };
}

export function calculateSegmentPath(
  startAngle: number,
  endAngle: number,
  radius = 50,
  center = 50
): string {
  const toRad = (deg: number) => (Math.PI * deg) / 180;
  const x1 = center + radius * Math.cos(toRad(startAngle));
  const y1 = center + radius * Math.sin(toRad(startAngle));
  const x2 = center + radius * Math.cos(toRad(endAngle));
  const y2 = center + radius * Math.sin(toRad(endAngle));

  return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
}

export function calculateIconCoordinates(
  startAngle: number,
  anglePerSegment: number,
  distance = 30,
  center = 50,
  iconOffset = 12
): { x: number; y: number } {
  const toRad = (deg: number) => (Math.PI * deg) / 180;
  const midAngle = startAngle + anglePerSegment / 2;

  return {
    x: center + distance * Math.cos(toRad(midAngle)) - iconOffset,
    y: center + distance * Math.sin(toRad(midAngle)) - iconOffset,
  };
}
