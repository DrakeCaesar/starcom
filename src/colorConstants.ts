// Define the data intervals for both gradients
export const gradient1Range = { min: -51, max: 127 };
export const gradient2Range = { min: -24, max: 224 };

// Polynomial coefficients for Gradient 1 (Order 13)
export const hueCoeffs1 = [
  1.08e-24, -1.6458e-21, 5.9792e-19, -7.1754e-17, -1.903e-15, 9.9128e-13,
  -3.7434e-11, -4.4037e-9, 2.6251e-7, 8.3536e-6, -5.3593e-4, -5.645e-3, 1.3851,
  6.4608e1,
];

export const saturationCoeffs1 = [
  3.9025e-23, -1.8541e-20, 2.5993e-18, 3.6865e-17, -3.3682e-14, 1.259e-12,
  1.5231e-10, -7.5495e-9, -3.2445e-7, 1.3969e-5, 3.0625e-4, -7.7753e-3,
  -9.9559e-2, 1.0018e2,
];

export const lightnessCoeffs1 = [
  -8.7953e-24, 4.2243e-21, -6.1954e-19, -3.3505e-18, 8.2969e-15, -4.6545e-13,
  -3.4206e-11, 3.3665e-9, 4.3884e-8, -9.7411e-6, -3.8164e-6, 1.3902e-2,
  -6.1203e-3, 4.7244e1,
];

// Polynomial coefficients for Gradient 2 (Order 13)
export const hueCoeffs2 = [
  -5.153e-28, 6.8154e-25, -3.1043e-22, 3.6092e-20, 1.3242e-17, -3.7569e-15,
  -4.9566e-14, 9.5761e-11, -3.9227e-9, -1.1084e-6, 5.9165e-5, 9.1471e-3, -1.214,
  2.4478e2,
];

export const saturationCoeffs2 = [
  2.2966e-29, -3.3799e-26, 1.7011e-23, -2.2155e-21, -7.9369e-19, 2.2702e-16,
  9.2765e-15, -6.3305e-12, -2.8724e-11, 7.9759e-8, 5.4664e-7, -5.8315e-4,
  1.8896e-2, 9.9931e1,
];

export const lightnessCoeffs2 = [
  -1.3279e-29, -1.2895e-26, 3.0892e-23, -1.6192e-20, 2.3427e-18, 5.2936e-16,
  -1.8137e-13, 3.5198e-12, 3.5782e-9, -2.637e-7, -2.715e-5, 3.3561e-3,
  -7.3413e-3, 5.0195e1,
];
