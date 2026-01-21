import React from 'react';
import {
  colors,
  spacing,
  radius,
  fontSize,
  fontFamily,
  shadows,
} from '../../styles/variables.jsx';

const Navbar = ({ style = {}, ...props }) => {
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing.md} ${spacing.lg}`,
    background: colors.accent5,
    boxShadow: shadows.md,
    borderRadius: radius.md,
    fontFamily: fontFamily.base,
    color: colors.bg,
    ...style,
  };

  return (
    <nav style={navStyle} {...props}>
      <div style={{ fontSize: fontSize.xl, fontWeight: 700 }}>©RIVIA</div>
      <div style={{ display: 'flex', gap: spacing.lg }}>
        <a href="/" style={{ color: colors.bg, textDecoration: 'none' }}>Home</a>
        <a href="/explore" style={{ color: colors.bg, textDecoration: 'none' }}>Explore</a>
        <a href="/profile" style={{ color: colors.bg, textDecoration: 'none' }}>Profile</a>
      </div>
    </nav>
  );
};

export default Navbar;
