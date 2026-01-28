import { useState, useEffect } from "react";

const useThemeColors = () => {
  const [colors, setColors] = useState(null);
  const [theme, setTheme] = useState("light"); // Default theme

  useEffect(() => {
    fetch("/colors.json")
      .then((response) => response.json())
      .then((data) => setColors(data))
      .catch((error) => console.error("Error loading colors:", error));
  }, []);

  const getColor = (key) => {
    return colors ? colors[key][theme] : "#000000"; // Default to black
  };

  return { getColor, theme, setTheme };
};

export default useThemeColors;
