import React, { useState, useEffect } from 'react';
import { colors, spacing, radius, fontSize, lineHeight, fontFamily, shadows, transitions } from '../../styles/variables.jsx';

const RegisterPage = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Inject keyframes animation
  useEffect(() => {
    const styleId = 'auth-animations';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideTextLeft {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          50% {
            opacity: 0;
            transform: translateX(-30px);
          }
          51% {
            opacity: 0;
            transform: translateX(30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideTextRight {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          50% {
            opacity: 0;
            transform: translateX(30px);
          }
          51% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isRegister && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      console.log(isRegister ? 'Register:' : 'Login:', formData);
      setLoading(false);
      alert(`${isRegister ? 'Registration' : 'Login'} successful! (Demo)`);
    }, 1000);
  };

  const handleGoogleAuth = () => {
    console.log('Google auth clicked');
    alert('Google authentication not yet configured');
  };

  const toggleForm = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      setIsRegister(!isRegister);
      setError('');
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'customer',
        confirmPassword: '',
      });
    }, 300);

    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  // Animation helper for form elements
  const getFormAnimationStyle = (index) => ({
    animation: isAnimating ? 'none' : `fadeIn 0.4s ease forwards`,
    animationDelay: `${index * 0.08}s`,
    opacity: 0,
  });

  // Styles using variables.jsx
  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      boxSizing: 'border-box',
      padding: spacing.lg,
    },
    background: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `linear-gradient(135deg, ${colors.accent5} 0%, ${colors.accent4} 50%, ${colors.bg} 100%)`,
      zIndex: -1,
    },
    wrapper: {
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
    },
    card: {
      position: 'relative',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      background: colors.bg,
      borderRadius: radius.xl,
      overflow: 'hidden',
      boxShadow: shadows.xl,
      border: `3px solid ${colors.bg}`,
      minHeight: isMobile ? 'auto' : '750px',
    },
    imageWrapper: {
      position: isMobile ? 'relative' : 'absolute',
      top: 0,
      left: isRegister ? '0' : '55%',
      width: isMobile ? '100%' : '45%',
      height: isMobile ? '150px' : '100%',
      zIndex: 5,
      transition: 'left 0.6s cubic-bezier(0.68, -0.15, 0.32, 1.15)',
    },
    imageSection: {
      width: '100%',
      height: '100%',
      background: `linear-gradient(135deg, ${colors.accent5}ee, ${colors.accent4}dd), url('https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&h=800&fit=crop')`,
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
    },
    imageTextWrapper: {
      animation: isAnimating 
        ? `${isRegister ? 'slideTextLeft' : 'slideTextRight'} 0.6s ease forwards` 
        : 'none',
    },
    imageText: {
      color: colors.bg,
      fontSize: isMobile ? fontSize.lg : fontSize['2xl'],
      fontWeight: 700,
      fontFamily: fontFamily.base,
      textAlign: 'center',
      textShadow: '0 2px 10px rgba(0,0,0,0.3)',
      margin: 0,
    },
    imageSubtext: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: fontSize.sm,
      fontFamily: fontFamily.base,
      textAlign: 'center',
      margin: 0,
      marginTop: spacing.sm,
    },
    contentWrapper: {
      display: 'flex',
      width: isMobile ? '100%' : '100%',
      height: '100%',
      position: 'relative',
      alignItems: 'center',
    },
    content: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '55%',
      height: '100%',
      padding: isMobile ? spacing.lg : spacing.xl,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: spacing.sm,
      boxSizing: 'border-box',
      minHeight: isMobile ? 'auto' : '750px',
      transition: 'opacity 0.4s ease, visibility 0.4s ease',
      zIndex: 20, // ✅ WAJIB
      paddingTop: spacing.xl, 
    },
    contentLogin: {
      left: 0,
      paddingRight: isMobile ? spacing.lg : spacing.lg,
      opacity: isRegister ? 0 : 1,
      visibility: isRegister ? 'hidden' : 'visible',
    },
    contentRegister: {
      right: 0,
      paddingLeft: isMobile ? spacing.lg : spacing.lg,
      opacity: isRegister ? 1 : 0,
      visibility: isRegister ? 'visible' : 'hidden',
    },
    header: {
      marginBottom: spacing.xs,
    },
    logo: {
      height: '40px',
      width: 'auto',
      marginBottom: spacing.xs,
    },
    title: {
      fontSize: isMobile ? fontSize['5xl'] : fontSize['5xl'],
      fontWeight: 700,
      color: colors.accent3,
      lineHeight: lineHeight.tight,
      fontFamily: fontFamily.base,
      margin: 0,
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.sm,
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.sm,
    },
    label: {
      fontSize: fontSize.sm,
      fontWeight: 600,
      color: colors.accent5,
      fontFamily: fontFamily.base,
    },
    input: {
      padding: `${spacing.sm} ${spacing.md}`,
      border: `2px solid ${colors.textLight}`,
      borderRadius: radius.md,
      backgroundColor: colors.bg,
      color: colors.text,
      fontSize: fontSize.base,
      fontFamily: fontFamily.base,
      transition: `all ${transitions.base}`,
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
    },
    error: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: colors.error,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: radius.md,
      fontSize: fontSize.sm,
      fontFamily: fontFamily.base,
    },
    button: {
      padding: `${spacing.sm} ${spacing.lg}`,
      border: 'none',
      borderRadius: radius.md,
      fontSize: fontSize.base,
      fontWeight: 600,
      cursor: 'pointer',
      transition: `all ${transitions.base}`,
      fontFamily: fontFamily.base,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xl,
      width: '100%',
      boxSizing: 'border-box',
      marginTop: spacing.xl,
    },
    buttonPrimary: {
      backgroundColor: colors.accent5,
      color: colors.bg,
    },
    buttonGoogle: {
      backgroundColor: colors.secondary,
      color: colors.bg,
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.md,
      margin: `${spacing.xs} 0`,
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      backgroundColor: colors.textLight,
    },
    dividerText: {
      color: colors.textLight,
      fontWeight: 500,
      fontFamily: fontFamily.base,
      fontSize: fontSize.sm,
    },
    footer: {
      textAlign: 'center',
      marginTop: spacing.xs,
    },
    footerText: {
      fontSize: fontSize.sm,
      color: colors.text,
      fontFamily: fontFamily.base,
      margin: 0,
    },
    link: {
      color: colors.primary,
      fontWeight: 700,
      textDecoration: 'none',
      transition: `all ${transitions.fast}`,
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0,
      fontSize: fontSize.sm,
      fontFamily: fontFamily.base,
    },
  };

  const renderForm = (isRegisterForm) => (
    <div style={{
      ...styles.content,
      ...(isRegisterForm ? styles.contentRegister : styles.contentLogin),
      ...(isMobile ? { position: 'relative', width: '100%', opacity: 1, visibility: 'visible' } : {}),
    }} key={isRegisterForm ? 'register-form' : 'login-form'}>
      <div style={{...styles.header, ...getFormAnimationStyle(0)}}>
        <img src="/src/assets/logo/logoPrimary.png" alt="ORIVIA" style={styles.logo} />
        <h2 style={styles.title}>
          {isRegisterForm ? ('Continue your journey') : (<>Start your <br /> perfect trip</>)}
        </h2>
      </div>

      <form style={styles.form} onSubmit={handleSubmit}>
        {isRegisterForm && (
          <>
          {/* help meeeee knp ini gaada di displayyyyyyyyyyyyyyyyyy:((((((((((((((((( */}
            {/* <div style={{...styles.formGroup, ...getFormAnimationStyle(1)}}>
              <label style={styles.label} htmlFor="role-reg">
                Role
              </label>
              <select
                style={{...styles.input, cursor: 'pointer'}}
                id="role-reg"
                name="role"
                value={formData.role}
                onChange={handleChange}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.accent5;
                  e.target.style.boxShadow = shadows.md;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.textLight;
                  e.target.style.boxShadow = 'none';
                }}
                required
              >
                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
              </select>
            </div> */}
            <div style={{ ...styles.formGroup, ...getFormAnimationStyle(1) }}>
              <label style={styles.label} htmlFor="role-reg">
                Role
              </label>

              <select
                style={{ ...styles.input, cursor: 'pointer' }}
                id="role-reg"
                name="role"
                value={formData.role || ''}   // ✅ safety
                onChange={handleChange}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.accent5;
                  e.target.style.boxShadow = shadows.md;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.textLight;
                  e.target.style.boxShadow = 'none';
                }}
                required
              >
                {/* ✅ OPTION DEFAULT */}
                <option value="" disabled>
                  Select role
                </option>

                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
              </select>
            </div>

            <div style={{...styles.formGroup, ...getFormAnimationStyle(2)}}>
              <label style={styles.label} htmlFor={`name-${isRegisterForm ? 'reg' : 'log'}`}>
                Full Name
              </label>
              <input
                style={styles.input}
                type="text"
                id={`name-${isRegisterForm ? 'reg' : 'log'}`}
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.accent5;
                  e.target.style.boxShadow = shadows.md;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.textLight;
                  e.target.style.boxShadow = 'none';
                }}
                required={isRegisterForm && isRegister}
              />
            </div>
          </>
        )}

        <div style={{...styles.formGroup, ...getFormAnimationStyle(isRegisterForm ? 3 : 1)}}>
          <label style={styles.label} htmlFor={`email-${isRegisterForm ? 'reg' : 'log'}`}>
            Email
          </label>
          <input
            style={styles.input}
            type="email"
            id={`email-${isRegisterForm ? 'reg' : 'log'}`}
            name="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            onFocus={(e) => {
              e.target.style.borderColor = colors.accent5;
              e.target.style.boxShadow = shadows.md;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.textLight;
              e.target.style.boxShadow = 'none';
            }}
            required
          />
        </div>

        <div style={{...styles.formGroup, ...getFormAnimationStyle(isRegisterForm ? 4 : 2)}}>
          <label style={styles.label} htmlFor={`password-${isRegisterForm ? 'reg' : 'log'}`}>
            Password
          </label>
          <input
            style={styles.input}
            type="password"
            id={`password-${isRegisterForm ? 'reg' : 'log'}`}
            name="password"
            placeholder={isRegisterForm ? "Create a strong password" : "Enter your password"}
            value={formData.password}
            onChange={handleChange}
            onFocus={(e) => {
              e.target.style.borderColor = colors.accent5;
              e.target.style.boxShadow = shadows.md;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.textLight;
              e.target.style.boxShadow = 'none';
            }}
            required
          />
        </div>

        {isRegisterForm && (
          <div style={{...styles.formGroup, ...getFormAnimationStyle(5)}}>
            <label style={styles.label} htmlFor="confirmPassword-reg">
              Confirm Password
            </label>
            <input
              style={styles.input}
              type="password"
              id="confirmPassword-reg"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={(e) => {
                e.target.style.borderColor = colors.accent5;
                e.target.style.boxShadow = shadows.md;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.textLight;
                e.target.style.boxShadow = 'none';
              }}
              required={isRegisterForm && isRegister}
            />
          </div>
        )}
        

        {error && isRegister === isRegisterForm && <div style={styles.error}>{error}</div>}

        <div style={getFormAnimationStyle(isRegisterForm ? 6 : 3)}>
          <button
            type="submit"
            style={{
              ...styles.button,
              ...styles.buttonPrimary,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading || isRegister !== isRegisterForm}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = colors.accent4;
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = shadows.lg;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = colors.accent5;
                e.target.style.transform = '';
                e.target.style.boxShadow = '';
              }
            }}
          >
            {loading && isRegister === isRegisterForm
              ? (isRegisterForm ? 'Creating account...' : 'Logging in...') 
              : (isRegisterForm ? 'Sign Up' : 'Login')}
          </button>
        </div>
      </form>

      <div style={{...styles.divider, ...getFormAnimationStyle(isRegisterForm ? 7 : 4)}}>
        <div style={styles.dividerLine}></div>
        <span style={styles.dividerText}>or</span>
        <div style={styles.dividerLine}></div>
      </div>

      <div style={getFormAnimationStyle(isRegisterForm ? 8 : 5)}>
        <button
          type="button"
          style={{
            ...styles.button,
            ...styles.buttonGoogle,
          }}
          onClick={handleGoogleAuth}
          disabled={isRegister !== isRegisterForm}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colors.primary;
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = shadows.lg;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colors.secondary;
            e.target.style.transform = '';
            e.target.style.boxShadow = '';
          }}
        >
          <span style={{ fontWeight: 700, fontSize: fontSize.lg }}>G</span>
          {isRegisterForm ? 'Sign up with Google' : 'Login with Google'}
        </button>
      </div>

      <div style={{...styles.footer, ...getFormAnimationStyle(isRegisterForm ? 9 : 6)}}>
        <p style={styles.footerText}>
          {isRegisterForm ? 'Already have an account? ' : "Don't have an account? "}
          <button 
            type="button"
            style={styles.link}
            onClick={toggleForm}
            disabled={isAnimating}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = 'none';
            }}
          >
            {isRegisterForm ? 'Login here' : 'Register here'}
          </button>
        </p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>

      <div style={styles.wrapper}>
        <div style={styles.card}>
          {/* Sliding Image */}
          <div style={styles.imageWrapper}>
            <div style={styles.imageSection}>
              <div style={styles.imageTextWrapper}>
              </div>
            </div>
          </div>

          {/* Forms Container */}
          {!isMobile && (
            <div style={styles.contentWrapper}>
              {renderForm(false)}
              {renderForm(true)}
            </div>
          )}

          {/* Mobile: Single Form */}
          {isMobile && (
            <div style={{ padding: spacing.lg }}>
              {renderForm(isRegister)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
