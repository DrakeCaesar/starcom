import { gradient1Range, gradient2Range, hueCoeffs1, hueCoeffs2, saturationCoeffs1, saturationCoeffs2, lightnessCoeffs1, lightnessCoeffs2 } from "./colorConstants";

export function getColor(x: number, useGradient1: boolean): string {
  // Function to evaluate the polynomial using Horner's method
  function evaluatePolynomial(coeffs: number[], x: number): number {
    return coeffs.reduce((acc, coeff) => acc * x + coeff, 0);
  }

  // Constrain x to the interval of the selected gradient
  const gradientRange = useGradient1 ? gradient1Range : gradient2Range;
  x = Math.max(gradientRange.min, Math.min(gradientRange.max, x));

  // Compute HSL values based on the selected gradient
  const hueCoeffs = useGradient1 ? hueCoeffs1 : hueCoeffs2;
  const saturationCoeffs = useGradient1 ? saturationCoeffs1 : saturationCoeffs2;
  const lightnessCoeffs = useGradient1 ? lightnessCoeffs1 : lightnessCoeffs2;

  let h = evaluatePolynomial(hueCoeffs, x);
  let s = evaluatePolynomial(saturationCoeffs, x);
  let l = evaluatePolynomial(lightnessCoeffs, x);

  // Rotate the hue by 180 degrees
  if (!useGradient1) {
    h = (h + 180) % 360;
  }

  // Ensure HSL values are within valid ranges
  h = ((h % 360) + 360) % 360; // Wrap hue to [0, 360)
  s = Math.max(0, Math.min(100, s)); // Clamp saturation to [0, 100]
  l = Math.max(0, Math.min(100, l)); // Clamp lightness to [0, 100]

  // Convert HSL to RGB
  function hslToRgb(
    h: number,
    s: number,
    l: number,
  ): { r: number; g: number; b: number } {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hPrime = h / 60;
    const x = c * (1 - Math.abs((hPrime % 2) - 1));
    let r1 = 0,
      g1 = 0,
      b1 = 0;

    if (0 <= hPrime && hPrime < 1) {
      r1 = c;
      g1 = x;
    } else if (1 <= hPrime && hPrime < 2) {
      r1 = x;
      g1 = c;
    } else if (2 <= hPrime && hPrime < 3) {
      g1 = c;
      b1 = x;
    } else if (3 <= hPrime && hPrime < 4) {
      g1 = x;
      b1 = c;
    } else if (4 <= hPrime && hPrime < 5) {
      r1 = x;
      b1 = c;
    } else if (5 <= hPrime && hPrime < 6) {
      r1 = c;
      b1 = x;
    }

    const m = l - c / 2;
    const r = Math.round((r1 + m) * 255);
    const g = Math.round((g1 + m) * 255);
    const b = Math.round((b1 + m) * 255);

    return { r, g, b };
  }

  // Convert RGB to Hexadecimal string
  function rgbToHex(r: number, g: number, b: number): string {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}
