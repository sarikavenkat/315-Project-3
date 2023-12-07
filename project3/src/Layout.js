// Layout.js
import React from 'react';
import { useTheme } from './ThemeContext';

/**Module to handle dark/light mode HTML
 * @module Layout
 */
const Layout = ({ children }) => {
  const { isDarkTheme } = useTheme();

  return (
    <div className={`page-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      {children}
    </div>
  );
};

export default Layout;
