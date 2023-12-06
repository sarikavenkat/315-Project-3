import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

/**Module to handle dark/light mode toggle
 * @module ThemeProvider
 */
export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  /** Function to toggle dark/light mode
   * @alias module:ThemeProvider.toggleTheme
   */
  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**Module to handle dark/light mode in React
 * @module useTheme
 */
export const useTheme = () => {
  return useContext(ThemeContext);
};
