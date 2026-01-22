const crypto = require("crypto");

class HexColor {
  constructor(hexColor) {
    this.colorValue = HexColor.getColorFromHex(hexColor);
  }

  static getColorFromHex(hexColor) {
    try {
      // Convert to uppercase and remove the '#' symbol
      hexColor = hexColor.toUpperCase().replace("#", "");

      // If it's a 6-character hex code, add "FF" for full opacity
      if (hexColor.length === 6) {
        hexColor = "FF" + hexColor;
      }

      // Parse the hex color to an integer
      return parseInt(hexColor, 16);
    } catch (e) {
      // Fallback to a random color
      const colors = [
        "#F44336", "#009688", "#4CAF50", "#9E9E9E", "#9C27B0", 
        "#607D8B", "#00BCD4", "#69F0AE", "#2196F3", "#795548", 
        "#FF5722", "#3F51B5", "#D4E157"
      ];

      // Generate a random index using crypto for better randomness
      const randomIndex = crypto.randomInt(0, colors.length);
      const fallbackColor = colors[randomIndex];
      return parseInt(fallbackColor.replace("#", ""), 16);
    }
  }

  getColor() {
    return `#${this.colorValue.toString(16).padStart(8, "0")}`;
  }
}

module.exports = HexColor;
