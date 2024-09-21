export function getColor(x: number, useGradient1: boolean): string {
  // Define the data intervals for both gradients
  const gradient1Range = { min: -51, max: 127 };
  const gradient2Range = { min: -24, max: 224 };

  // Polynomial coefficients for Gradient 1 (Order 13)
  const hueCoeffs1 = [
    1.08e-24, // x^13
    -1.6458e-21, // x^12
    5.9792e-19, // x^11
    -7.1754e-17, // x^10
    -1.903e-15, // x^9
    9.9128e-13, // x^8
    -3.7434e-11, // x^7
    -4.4037e-9, // x^6
    2.6251e-7, // x^5
    8.3536e-6, // x^4
    -5.3593e-4, // x^3
    -5.645e-3, // x^2
    1.3851, // x^1
    6.4608e1, // x^0
  ];

  const saturationCoeffs1 = [
    3.9025e-23, -1.8541e-20, 2.5993e-18, 3.6865e-17, -3.3682e-14, 1.259e-12,
    1.5231e-10, -7.5495e-9, -3.2445e-7, 1.3969e-5, 3.0625e-4, -7.7753e-3,
    -9.9559e-2, 1.0018e2,
  ];

  const lightnessCoeffs1 = [
    -8.7953e-24, 4.2243e-21, -6.1954e-19, -3.3505e-18, 8.2969e-15, -4.6545e-13,
    -3.4206e-11, 3.3665e-9, 4.3884e-8, -9.7411e-6, -3.8164e-6, 1.3902e-2,
    -6.1203e-3, 4.7244e1,
  ];

  // Polynomial coefficients for Gradient 2 (Order 13)
  const hueCoeffs2 = [
    -5.153e-28, 6.8154e-25, -3.1043e-22, 3.6092e-20, 1.3242e-17, -3.7569e-15,
    -4.9566e-14, 9.5761e-11, -3.9227e-9, -1.1084e-6, 5.9165e-5, 9.1471e-3,
    -1.214, 2.4478e2,
  ];

  const saturationCoeffs2 = [
    2.2966e-29, -3.3799e-26, 1.7011e-23, -2.2155e-21, -7.9369e-19, 2.2702e-16,
    9.2765e-15, -6.3305e-12, -2.8724e-11, 7.9759e-8, 5.4664e-7, -5.8315e-4,
    1.8896e-2, 9.9931e1,
  ];

  const lightnessCoeffs2 = [
    -1.3279e-29, -1.2895e-26, 3.0892e-23, -1.6192e-20, 2.3427e-18, 5.2936e-16,
    -1.8137e-13, 3.5198e-12, 3.5782e-9, -2.637e-7, -2.715e-5, 3.3561e-3,
    -7.3413e-3, 5.0195e1,
  ];

  // Function to evaluate the polynomial using Horner's method
  function evaluatePolynomial(coeffs: number[], x: number): number {
    let result = 0;
    for (let coeff of coeffs) {
      result = result * x + coeff;
    }
    return result;
  }

  // Constrain x to the interval of the selected gradient
  if (useGradient1) {
    x = Math.max(gradient1Range.min, Math.min(gradient1Range.max, x));
  } else {
    x = Math.max(gradient2Range.min, Math.min(gradient2Range.max, x));
  }

  // Compute HSL values based on the selected gradient
  let h: number, s: number, l: number;

  if (useGradient1) {
    h = evaluatePolynomial(hueCoeffs1, x);
    s = evaluatePolynomial(saturationCoeffs1, x);
    l = evaluatePolynomial(lightnessCoeffs1, x);
  } else {
    h = evaluatePolynomial(hueCoeffs2, x);
    s = evaluatePolynomial(saturationCoeffs2, x);
    l = evaluatePolynomial(lightnessCoeffs2, x);
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
  const hexColor = rgbToHex(r, g, b);

  return hexColor;
}
