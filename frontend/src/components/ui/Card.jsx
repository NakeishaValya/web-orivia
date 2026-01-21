import React from 'react';
import {
  colors,
  spacing,
  radius,
  fontFamily,
  shadows,
} from '../../styles/variables.jsx';

const Card = ({ children, style = {}, ...props }) => {
  const cardStyle = {
    background: colors.bg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    boxShadow: shadows.md,
    fontFamily: fontFamily.base,
    ...style,
  };

  return (
    <div style={cardStyle} {...props}>
      {children}
    </div>
  );
};

export default Card;
