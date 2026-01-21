import React from 'react';
import Navbar from '../components/ui/Navbar.jsx';
import {
  colors,
  spacing,
  fontFamily,
} from '../styles/variables.jsx';

const CustomerLayout = ({ children }) => {
  const layoutStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: fontFamily.base,
    backgroundColor: colors.bg,
  };

  const contentStyle = {
    flex: 1,
    padding: spacing.lg,
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  };

  return (
    <div style={layoutStyle}>
      <Navbar />
      <main style={contentStyle}>{children}</main>
    </div>
  );
};

export default CustomerLayout;
