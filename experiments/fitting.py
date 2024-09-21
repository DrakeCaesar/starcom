import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit
import colorsys
import pandas as pd

# Input data: Gradient 1 and Gradient 2
data_1 = {
    "numbers": [-51, -48, -37, -35, -30, -28, -25, -20, -16, -14, -12, -12, -11, -9, -8, -6, -5, -4, -4, 1, 1, 12, 18, 22, 23, 25, 25, 30, 36, 45, 49, 54, 59, 65, 76, 82, 93, 108, 127],
    "hex_colors": ["#FF4926", "#FF5522", "#FF7616", "#FF7E16", "#FF8D16", "#FF940D", "#FF9F0D", "#FFB10D", "#FFBB00", "#FFC200", "#FFC900", "#FFCB00", "#FFCC00", "#FAD500", "#F7D700", "#EFDE00", "#ECE000", "#E6E500", "#E8E300", "#D2F600", "#D5F400", "#ADFF00", "#99FE0D", "#88FE0D", "#86FE0D", "#80FE0D", "#7FFE0D", "#6EFE16", "#58FD16", "#3BFD1C", "#2AFD22", "#26F938", "#22F456", "#22EE7C", "#1CE7A7", "#16E2D9", "#00D0FF", "#008DFE", "#008EFF"]
}

data_2 = {
    "numbers": [224, 198, 177, 160, 147, 136, 127, 111, 101, 89, 82, 78, 76, 73, 57, 47, 46, 44, 42, 38, 37, 36, 34, 31, 26, 24, 23, 22, 20, 16, 11, 8, -3, -7, -24],
    "hex_colors": ["#F53240", "#F82E3B", "#FB2E35", "#FD2E32", "#FF2E2E", "#FF322A", "#FF382A", "#FF4526", "#FF4B22", "#FF5622", "#FF5D22", "#FF601C", "#FF631C", "#FF661C", "#FF7A16", "#FF8816", "#FF8A16", "#FF8D16", "#FF8F16", "#FF970D", "#FF980D", "#FF990D", "#FF9E0D", "#FFA40D", "#FFAE0D", "#FFB10D", "#FFB50D", "#FFB50D", "#FFBB00", "#FFC300", "#FFD000", "#F6D800", "#CBFC00", "#BCFF00", "#66FE16"]
}

# Function to convert hex to RGB
def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

# Convert hex to RGB
def convert_hex_to_rgb_list(data):
    return np.array([hex_to_rgb(color) for color in data['hex_colors']])

rgb_values_1 = convert_hex_to_rgb_list(data_1)
rgb_values_2 = convert_hex_to_rgb_list(data_2)

# Function to convert RGB to HSL
def rgb_to_hsl(rgb):
    r, g, b = [x / 255.0 for x in rgb]  # Normalize RGB to [0,1]
    return colorsys.rgb_to_hls(r, g, b)

# Convert RGB values to HSL for both datasets
hsl_values_1 = np.array([rgb_to_hsl(rgb) for rgb in rgb_values_1])
hsl_values_2 = np.array([rgb_to_hsl(rgb) for rgb in rgb_values_2])

# Convert hue from [0,1] to degrees [0,360], and lightness/saturation to percentages
hsl_values_1[:, 0] *= 360  # Hue
hsl_values_1[:, 1:] *= 100  # Lightness and Saturation

hsl_values_2[:, 0] *= 360  # Hue
hsl_values_2[:, 1:] *= 100  # Lightness and Saturation

# Shift hue by 180 degrees for the second dataset and wrap around using modulo 360
hsl_values_2_shifted = hsl_values_2.copy()
hsl_values_2_shifted[:, 0] = (hsl_values_2_shifted[:, 0] + 180) % 360

# Define how far to extend (number of extra points at each end)
num_extra_points = 5

# Function to linearly extend a dataset
def linear_extension(x_values, y_values, num_points, extend_forward=True):
    if extend_forward:
        # Calculate slope from last two points
        slope = (y_values[-1] - y_values[-2]) / (x_values[-1] - x_values[-2])
        # Extend forward
        x_extension = np.linspace(x_values[-1], x_values[-1] + (x_values[-1] - x_values[-2]) * num_points, num_points + 1)[1:]
        y_extension = y_values[-1] + slope * (x_extension - x_values[-1])
    else:
        # Calculate slope from first two points
        slope = (y_values[1] - y_values[0]) / (x_values[1] - x_values[0])
        # Extend backward
        x_extension = np.linspace(x_values[0] - (x_values[1] - x_values[0]) * num_points, x_values[0], num_points + 1)[:-1]
        y_extension = y_values[0] + slope * (x_extension - x_values[0])
    return x_extension, y_extension

# Extend both the start and end of each set

# Extend the first dataset (Gradient 1)
x_start_1, h_start_1 = linear_extension(data_1['numbers'], hsl_values_1[:, 0], num_extra_points, extend_forward=False)
x_end_1, h_end_1 = linear_extension(data_1['numbers'], hsl_values_1[:, 0], num_extra_points, extend_forward=True)

_, s_start_1 = linear_extension(data_1['numbers'], hsl_values_1[:, 2], num_extra_points, extend_forward=False)
_, s_end_1 = linear_extension(data_1['numbers'], hsl_values_1[:, 2], num_extra_points, extend_forward=True)

_, l_start_1 = linear_extension(data_1['numbers'], hsl_values_1[:, 1], num_extra_points, extend_forward=False)
_, l_end_1 = linear_extension(data_1['numbers'], hsl_values_1[:, 1], num_extra_points, extend_forward=True)

# Combine original and extended sets for first dataset
numbers_1_extended = np.concatenate([x_start_1, data_1['numbers'], x_end_1])
hsl_values_1_extended = np.vstack([np.column_stack([h_start_1, l_start_1, s_start_1]), hsl_values_1, np.column_stack([h_end_1, l_end_1, s_end_1])])

# Extend the second dataset (Gradient 2)
x_start_2, h_start_2 = linear_extension(data_2['numbers'], hsl_values_2_shifted[:, 0], num_extra_points, extend_forward=False)
x_end_2, h_end_2 = linear_extension(data_2['numbers'], hsl_values_2_shifted[:, 0], num_extra_points, extend_forward=True)

_, s_start_2 = linear_extension(data_2['numbers'], hsl_values_2[:, 2], num_extra_points, extend_forward=False)
_, s_end_2 = linear_extension(data_2['numbers'], hsl_values_2[:, 2], num_extra_points, extend_forward=True)

_, l_start_2 = linear_extension(data_2['numbers'], hsl_values_2[:, 1], num_extra_points, extend_forward=False)
_, l_end_2 = linear_extension(data_2['numbers'], hsl_values_2[:, 1], num_extra_points, extend_forward=True)

# Combine original and extended sets for second dataset
numbers_2_extended = np.concatenate([x_start_2, data_2['numbers'], x_end_2])
hsl_values_2_extended = np.vstack([np.column_stack([h_start_2, l_start_2, s_start_2]), hsl_values_2_shifted, np.column_stack([h_end_2, l_end_2, s_end_2])])

# Define the fitting function (n-th order polynomial)
def polynomial_fit(order):
    def fit_function(x, *coeffs):
        return sum(c * x**i for i, c in enumerate(reversed(coeffs)))
    return fit_function

# Function to format polynomial coefficients into a string
def format_polynomial(coeffs):
    order = len(coeffs) - 1
    terms = []
    for i, c in enumerate(coeffs):
        power = order - i
        c_formatted = f"{c:.4e}"  # Scientific notation
        if power == 0:
            term = f"{c_formatted}"
        elif power == 1:
            term = f"{c_formatted} * x"
        else:
            term = f"{c_formatted} * x^{power}"
        terms.append(term)
    equation = " + ".join(terms)
    return equation

# Initialize list to store coefficients
coefficients_list = []

# Loop over fit orders from 1 to 31
for fit_order in range(1, 32):
    # Perform polynomial fitting for both extended datasets (Gradient 1 and Gradient 2)
    
    # Gradient 1
    popt_h_1, _ = curve_fit(polynomial_fit(fit_order), numbers_1_extended, hsl_values_1_extended[:, 0], p0=[1] * (fit_order + 1))
    popt_s_1, _ = curve_fit(polynomial_fit(fit_order), numbers_1_extended, hsl_values_1_extended[:, 2], p0=[1] * (fit_order + 1))
    popt_l_1, _ = curve_fit(polynomial_fit(fit_order), numbers_1_extended, hsl_values_1_extended[:, 1], p0=[1] * (fit_order + 1))
    
    # Gradient 2
    popt_h_2, _ = curve_fit(polynomial_fit(fit_order), numbers_2_extended, hsl_values_2_extended[:, 0], p0=[1] * (fit_order + 1))
    popt_s_2, _ = curve_fit(polynomial_fit(fit_order), numbers_2_extended, hsl_values_2_extended[:, 2], p0=[1] * (fit_order + 1))
    popt_l_2, _ = curve_fit(polynomial_fit(fit_order), numbers_2_extended, hsl_values_2_extended[:, 1], p0=[1] * (fit_order + 1))
    
    # Generate smooth range for plotting the fit (within original data range)
    x_smooth_1 = np.linspace(min(data_1['numbers']), max(data_1['numbers']), 500)
    x_smooth_2 = np.linspace(min(data_2['numbers']), max(data_2['numbers']), 500)
    
    # Apply the fitted polynomial to the smooth x-range
    fitted_h_1 = polynomial_fit(fit_order)(x_smooth_1, *popt_h_1)
    fitted_s_1 = polynomial_fit(fit_order)(x_smooth_1, *popt_s_1)
    fitted_l_1 = polynomial_fit(fit_order)(x_smooth_1, *popt_l_1)
    
    fitted_h_2 = polynomial_fit(fit_order)(x_smooth_2, *popt_h_2)
    fitted_s_2 = polynomial_fit(fit_order)(x_smooth_2, *popt_s_2)
    fitted_l_2 = polynomial_fit(fit_order)(x_smooth_2, *popt_l_2)
    
    # Store coefficients and equations
    coefficients_list.extend([
        {
            'Fit Order': fit_order,
            'Dataset': 'Gradient 1',
            'Channel': 'Hue',
            'Coefficients': popt_h_1,
            'Equation': format_polynomial(popt_h_1)
        },
        {
            'Fit Order': fit_order,
            'Dataset': 'Gradient 1',
            'Channel': 'Saturation',
            'Coefficients': popt_s_1,
            'Equation': format_polynomial(popt_s_1)
        },
        {
            'Fit Order': fit_order,
            'Dataset': 'Gradient 1',
            'Channel': 'Lightness',
            'Coefficients': popt_l_1,
            'Equation': format_polynomial(popt_l_1)
        },
        {
            'Fit Order': fit_order,
            'Dataset': 'Gradient 2',
            'Channel': 'Hue (Shifted)',
            'Coefficients': popt_h_2,
            'Equation': format_polynomial(popt_h_2)
        },
        {
            'Fit Order': fit_order,
            'Dataset': 'Gradient 2',
            'Channel': 'Saturation',
            'Coefficients': popt_s_2,
            'Equation': format_polynomial(popt_s_2)
        },
        {
            'Fit Order': fit_order,
            'Dataset': 'Gradient 2',
            'Channel': 'Lightness',
            'Coefficients': popt_l_2,
            'Equation': format_polynomial(popt_l_2)
        }
    ])
    
    # Plot the results
    plt.figure(figsize=(12, 10))
    
    # Plot for Gradient 1
    plt.subplot(2, 1, 1)
    plt.plot(data_1['numbers'], hsl_values_1[:, 0], 'ro', label="Hue")
    plt.plot(data_1['numbers'], hsl_values_1[:, 2], 'go', label="Saturation")
    plt.plot(data_1['numbers'], hsl_values_1[:, 1], 'bo', label="Lightness")
    plt.plot(x_smooth_1, fitted_h_1, 'r-', label=f"Fitted Hue (Order {fit_order})")
    plt.plot(x_smooth_1, fitted_s_1, 'g-', label=f"Fitted Saturation (Order {fit_order})")
    plt.plot(x_smooth_1, fitted_l_1, 'b-', label=f"Fitted Lightness (Order {fit_order})")
    plt.xlabel("Numbers")
    plt.ylabel("HSL Values")
    plt.legend()
    plt.title(f"Gradient 1: {fit_order}th-Order Polynomial Fitting of HSL Channels")
    plt.grid(True)
    
    # Plot for Gradient 2
    plt.subplot(2, 1, 2)
    plt.plot(data_2['numbers'], hsl_values_2_shifted[:, 0], 'ro', label="Shifted Hue")
    plt.plot(data_2['numbers'], hsl_values_2[:, 2], 'go', label="Saturation")
    plt.plot(data_2['numbers'], hsl_values_2[:, 1], 'bo', label="Lightness")
    plt.plot(x_smooth_2, fitted_h_2, 'r-', label=f"Fitted Shifted Hue (Order {fit_order})")
    plt.plot(x_smooth_2, fitted_s_2, 'g-', label=f"Fitted Saturation (Order {fit_order})")
    plt.plot(x_smooth_2, fitted_l_2, 'b-', label=f"Fitted Lightness (Order {fit_order})")
    plt.xlabel("Numbers")
    plt.ylabel("HSL Values")
    plt.legend()
    plt.title(f"Gradient 2: {fit_order}th-Order Polynomial Fitting of Shifted HSL Channels")
    plt.grid(True)
    
    plt.tight_layout()
    # Save the figures to files instead of showing them
    plt.savefig(f"images/plots/polynomial_fit_order_{fit_order}.png")
    plt.close()  # Close the figure to free memory

# Create a DataFrame from the coefficients list
coefficients_df = pd.DataFrame(coefficients_list)

# Print the fitting functions as a table for each order
for order in range(1, 29):
    print(f"\nFitting Functions for Polynomial Order {order}:\n")
    df_order = coefficients_df[coefficients_df['Fit Order'] == order]
    print(df_order[['Dataset', 'Channel', 'Equation']].to_string(index=False))
