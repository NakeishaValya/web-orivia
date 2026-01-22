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

// AuthCard: reusable card component for auth pages (Login / Register)
export const AuthCard = ({ children, style = {}, image, isMobile = false, imageWrapperStyle = {}, imageSectionStyle = {}, ...props }) => {
  const authStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    background: colors.bg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    boxShadow: shadows.xl,
    border: `10px solid ${colors.bg}`,
    minHeight: isMobile ? 'auto' : '750px',
    ...style,
  };

  return (
    <div style={authStyle} {...props}>
      {/* Optional left image section inside the card for auth pages */}
      {image && (
        <div style={{
          position: isMobile ? 'relative' : 'absolute',
          top: 0,
          left: isMobile ? 0 : '0',
          width: isMobile ? '100%' : '45%',
          height: isMobile ? '150px' : '100%',
          zIndex: 10,
          transition: 'left 0.6s cubic-bezier(0.68, -0.15, 0.32, 1.15)',
          ...imageWrapperStyle,
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(100deg, ${colors.text}66, ${colors.textLight}33), url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: isMobile ? 0 : radius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: spacing.sm,
            padding: spacing.xl,
            boxSizing: 'border-box',
            ...imageSectionStyle,
          }} />
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
