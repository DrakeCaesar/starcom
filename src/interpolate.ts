type ColorPoint = {
  value: number;
  hexColor: string;
};

const set1: ColorPoint[] = [
  { value: -51, hexColor: "#FF4926" },
  { value: -48, hexColor: "#FF5522" },
  { value: -37, hexColor: "#FF7616" },
  { value: -35, hexColor: "#FF7E16" },
  { value: -30, hexColor: "#FF8D16" },
  { value: -28, hexColor: "#FF940D" },
  { value: -25, hexColor: "#FF9F0D" },
  { value: -20, hexColor: "#FFB10D" },
  { value: -16, hexColor: "#FFBB00" },
  { value: -14, hexColor: "#FFC200" },
  { value: -12, hexColor: "#FFC900" },
  { value: -12, hexColor: "#FFCB00" },
  { value: -11, hexColor: "#FFCC00" },
  { value: -9, hexColor: "#FAD500" },
  { value: -8, hexColor: "#F7D700" },
  { value: -6, hexColor: "#EFDE00" },
  { value: -5, hexColor: "#ECE000" },
  { value: -4, hexColor: "#E6E500" },
  { value: -4, hexColor: "#E8E300" },
  { value: 1, hexColor: "#D2F600" },
  { value: 1, hexColor: "#D5F400" },
  { value: 12, hexColor: "#ADFF00" },
  { value: 18, hexColor: "#99FE0D" },
  { value: 22, hexColor: "#88FE0D" },
  { value: 23, hexColor: "#86FE0D" },
  { value: 25, hexColor: "#80FE0D" },
  { value: 25, hexColor: "#7FFE0D" },
  { value: 30, hexColor: "#6EFE16" },
  { value: 36, hexColor: "#58FD16" },
  { value: 45, hexColor: "#3BFD1C" },
  { value: 49, hexColor: "#2AFD22" },
  { value: 54, hexColor: "#26F938" },
  { value: 59, hexColor: "#22F456" },
  { value: 65, hexColor: "#22EE7C" },
  { value: 76, hexColor: "#1CE7A7" },
  { value: 82, hexColor: "#16E2D9" },
  { value: 93, hexColor: "#00D0FF" },
  { value: 108, hexColor: "#008DFE" },
  { value: 127, hexColor: "#008EFF" },
];

const set2: ColorPoint[] = [
  { value: 224, hexColor: "#F53240" },
  { value: 198, hexColor: "#F82E3B" },
  { value: 177, hexColor: "#FB2E35" },
  { value: 160, hexColor: "#FD2E32" },
  { value: 147, hexColor: "#FF2E2E" },
  { value: 136, hexColor: "#FF322A" },
  { value: 127, hexColor: "#FF382A" },
  { value: 111, hexColor: "#FF4526" },
  { value: 101, hexColor: "#FF4B22" },
  { value: 89, hexColor: "#FF5622" },
  { value: 82, hexColor: "#FF5D22" },
  { value: 78, hexColor: "#FF601C" },
  { value: 76, hexColor: "#FF631C" },
  { value: 73, hexColor: "#FF661C" },
  { value: 57, hexColor: "#FF7A16" },
  { value: 47, hexColor: "#FF8816" },
  { value: 46, hexColor: "#FF8A16" },
  { value: 44, hexColor: "#FF8D16" },
  { value: 42, hexColor: "#FF8F16" },
  { value: 38, hexColor: "#FF970D" },
  { value: 37, hexColor: "#FF980D" },
  { value: 36, hexColor: "#FF990D" },
  { value: 34, hexColor: "#FF9E0D" },
  { value: 31, hexColor: "#FFA40D" },
  { value: 26, hexColor: "#FFAE0D" },
  { value: 24, hexColor: "#FFB10D" },
  { value: 23, hexColor: "#FFB50D" },
  { value: 22, hexColor: "#FFB50D" },
  { value: 20, hexColor: "#FFC300" },
  { value: 16, hexColor: "#FFBB00" },
  { value: 11, hexColor: "#FFD000" },
  { value: 8, hexColor: "#F6D800" },
  { value: -3, hexColor: "#CBFC00" },
  { value: -7, hexColor: "#BCFF00" },
  { value: -24, hexColor: "#66FE16" },
];

// Helper function to convert hex to RGB
function hexToRgb(hex: string): [number, number, number] {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

// Helper function to convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}

// Linear interpolation function
function lerp(start: number, end: number, t: number): number {
  return start + t * (end - start);
}

// Function to find the two closest points and interpolate between them
function interpolateColor(value: number, useSet1: boolean): string {
  const set = useSet1 ? set1 : set2;

  // Find two closest points
  let lower: ColorPoint | null = null;
  let upper: ColorPoint | null = null;

  for (let i = 0; i < set.length; i++) {
    if (set[i].value <= value) {
      lower = set[i];
    }
    if (set[i].value >= value) {
      upper = set[i];
      break;
    }
  }

  // Handle extrapolation (if value is outside the set's range)
  if (!lower) lower = set[0];
  if (!upper) upper = set[set.length - 1];

  // Convert hex colors to RGB
  const [r1, g1, b1] = hexToRgb(lower.hexColor);
  const [r2, g2, b2] = hexToRgb(upper.hexColor);

  // Calculate interpolation factor
  const t = (value - lower.value) / (upper.value - lower.value);

  // Interpolate each color channel
  const r = Math.round(lerp(r1, r2, t));
  const g = Math.round(lerp(g1, g2, t));
  const b = Math.round(lerp(b1, b2, t));

  // Convert back to hex and return
  return rgbToHex(r, g, b);
}

// Example usage:
console.log(interpolateColor(50, true)); // Interpolates from set 1
console.log(interpolateColor(100, false)); // Interpolates from set 2
