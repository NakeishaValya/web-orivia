import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar, 
  faLocationDot, 
  faUsers, 
  faCheck,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/ui/Navbar.jsx';
import Button from '../../components/ui/Button';
import { colors, spacing, radius, fontSize, fontFamily } from '../../styles/variables';

// Sample rundown data
const RUNDOWN_DATA = {
  1: [
    { time: '06.00 - 07.00', duration: '1', activity: 'Meeting point & briefing', location: 'Bandar Udara Komodo' },
    { time: '07.00 - 09.30', duration: '2.5', activity: 'Sailing', location: 'Padar Island' },
    { time: '09.30 - 11.00', duration: '1.5', activity: 'Trekking & sightseeing', location: 'Padar Island' },
    { time: '11.00 - 13.00', duration: '2', activity: 'Beach time & snorkeling', location: 'Pink Beach' },
    { time: '13.00 - 14.00', duration: '1', activity: 'Lunch', location: 'On Boat' },
    { time: '14.00 - 16.00', duration: '2', activity: 'Komodo trekking', location: 'Komodo Island' },
    { time: '16.00 - 19.00', duration: '3', activity: 'Sunset and Dinner', location: 'Sunset and Dinner' }
  ],
  2: [
    { time: '06.00 - 08.00', duration: '2', activity: 'Breakfast & check out', location: 'Hotel' },
    { time: '08.00 - 10.00', duration: '2', activity: 'Island hopping', location: 'Kanawa Island' },
    { time: '10.00 - 12.00', duration: '2', activity: 'Snorkeling', location: 'Manta Point' },
    { time: '12.00 - 13.00', duration: '1', activity: 'Lunch', location: 'Local Restaurant' }
  ]
};

const INCLUDES = [
  'Guide',
  'Meals',
  'First Aid',
  'Insurance',
  'Entrance Ticket',
  'Transportation',
  'Documentation',
  'Accommodation'
];

const PICKUP_POINTS = [
  'Orivia Agent Gambir, Jakarta',
  'Orivia Agent Pasteur, Bandung',
  'Komodo Airport, Labuan Bajo',
  'Soekarno Hatta Airport, Jakarta'
];

export default function BookingPage() {
  const [selectedDay, setSelectedDay] = useState(1);

  return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#E8E4DC',
        fontFamily: fontFamily.base
      }}>
      {/* Fixed Navbar */}
      <Navbar style={{ 
        position: 'sticky', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 100,
        backgroundColor: colors.bg
      }} />

      {/* Main Container */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: spacing.lg
      }}>
        
        {/* Top Section: Image + Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '0.5fr 0.5fr',
          gap: spacing.xl,
          marginBottom: spacing.xl
        }}>
          
          {/* LAYOUT 1 - Image (Left) */}
          <div style={{
            position: 'relative',
            borderRadius: radius.lg,
            overflow: 'hidden',
            height: '100%',
            minHeight: '600px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop" 
              alt="Labuan Bajo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* LAYOUT 2 - Information (Right) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.lg
          }}>

            {/* 2.1 Description & Action - title left, price card right */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing.lg, alignItems: 'flex-start' }}>
              <div>
                <h1 style={{
                  fontSize: '40px',
                  fontWeight: 800,
                  color: colors.accent5,
                  marginBottom: spacing.xs,
                  fontFamily: fontFamily.base,
                  lineHeight: 1.2
                }}>
                  Labuan Bajo
                </h1>
                <p style={{
                  fontSize: fontSize.xl,
                  color: colors.accent4,
                  fontWeight: 600,
                  marginBottom: spacing.xs
                }}>
                  2D1N • Island Exploration
                </p>
              </div>

              <div style={{ minWidth: 220, maxWidth: 300 }}>
                <div style={{
                  backgroundColor: colors.bg,
                  padding: spacing.lg,
                  borderRadius: radius.lg,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    fontSize: fontSize.sm,
                    color: colors.text,
                    marginBottom: spacing.xs
                  }}>
                    Starting from
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: colors.accent4,
                    marginBottom: spacing.md
                  }}>
                    Rp4.575.000,00<span style={{ fontSize: fontSize.lg, fontWeight: 600 }}>/pax</span>
                  </div>
                  <Button 
                    variant="primary" 
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      fontSize: fontSize.md,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: spacing.sm
                    }}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                    Book Trip
                  </Button>
                </div>
              </div>
            </div>

            {/* Grid: Trip Information + Include / Pick-Up Point + Include */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '0.7fr 0.5fr',
              gridTemplateRows: 'auto auto',
              gap: spacing.lg,
              flex: 1,
              alignItems: 'stretch'
            }}>
              
              {/* 2.2 Trip Information Card (Top Left) */}
              <div style={{
                backgroundColor: '#E8A962',
                borderRadius: radius.lg,
                padding: spacing.lg,
                border: '2px solid #C9935A',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{
                  fontSize: fontSize.xl,
                  fontWeight: 700,
                  color: colors.bg,
                  marginBottom: spacing.md,
                  fontFamily: fontFamily.base
                }}>
                  Trip Information
                </h3>
                <div className="custom-scrollbar" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.sm,
                  maxHeight: '150px',
                  overflowY: 'auto',
                  paddingRight: spacing.sm,
                  boxSizing: 'border-box'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    color: colors.bg,
                    fontSize: fontSize.base
                  }}>
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>1-2 February 2026</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    color: colors.bg,
                    fontSize: fontSize.base
                  }}>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <span>East Nusa Tenggara, Indonesia</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    color: colors.bg,
                    fontSize: fontSize.base
                  }}>
                    <FontAwesomeIcon icon={faUsers} />
                    <span>8/15 Slots Available</span>
                  </div>
                </div>
              </div>

              {/* 2.4 Include Card (Right Side - Spans 2 Rows) */}
              <div style={{
                backgroundColor: '#E8A962',
                borderRadius: radius.lg,
                padding: spacing.md,
                border: '2px solid #C9935A',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                gridRow: 'span 2',
                alignSelf: 'stretch',
                height: '100%',
                boxSizing: 'border-box'
              }}>
                <h3 style={{
                  fontSize: fontSize.xl,
                  fontWeight: 700,
                  color: colors.bg,
                  marginBottom: spacing.md,
                  fontFamily: fontFamily.base
                }}>
                  Include
                </h3>
                <div className="custom-scrollbar" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.sm,
                  maxHeight: '280px',
                  overflowY: 'auto',
                  paddingRight: spacing.sm,
                  boxSizing: 'border-box'
                }}>
                  {INCLUDES.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                      color: colors.bg,
                      fontSize: fontSize.base
                    }}>
                      <FontAwesomeIcon icon={faCheck} style={{ width: 16 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2.3 Pick-Up Point Card (Bottom Left) */}
              <div style={{
                backgroundColor: '#E8A962',
                borderRadius: radius.lg,
                padding: spacing.lg,
                border: '2px solid #C9935A',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{
                  fontSize: fontSize.xl,
                  fontWeight: 700,
                  color: colors.bg,
                  marginBottom: spacing.md,
                  fontFamily: fontFamily.base
                }}>
                  Pick-Up Point
                </h3>
                <div className="custom-scrollbar" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.sm,
                  maxHeight: '100px',
                  overflowY: 'auto',
                  paddingRight: spacing.xs,
                  boxSizing: 'border-box'
                }}>
                  {PICKUP_POINTS.map((point, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                      color: colors.bg,
                      fontSize: fontSize.base
                    }}>
                      <FontAwesomeIcon icon={faLocationDot} style={{ width: 16 }} />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Rundown Section */}
        <div>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 800,
            color: colors.accent5,
            marginBottom: spacing.lg,
            fontFamily: fontFamily.base
          }}>
            Rundown
          </h2>

          {/* Day Selector */}
          <div style={{
            marginBottom: spacing.md,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md
          }}>
            <label style={{
              fontSize: fontSize.lg,
              fontWeight: 600,
              color: colors.bg,
              fontFamily: fontFamily.base
            }}>
              Day
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
                style={{
                  backgroundColor: colors.accent5,
                  color: colors.bg,
                  border: 'none',
                  borderRadius: radius.md,
                  padding: `${spacing.sm} ${spacing.lg}`,
                  paddingRight: '40px',
                  fontSize: fontSize.base,
                  fontWeight: 600,
                  cursor: 'pointer',
                  appearance: 'none',
                  fontFamily: fontFamily.base,
                  outline: 'none'
                }}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                style={{
                  position: 'absolute',
                  right: spacing.md,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: colors.bg
                }}
              />
            </div>
          </div>

          {/* Rundown Table */}
          <div style={{
            backgroundColor: 'rgba(117, 121, 91, 0.6)',
            borderRadius: radius.lg,
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(117, 121, 91, 0.9)' }}>
                  <th style={{
                    padding: spacing.md,
                    textAlign: 'left',
                    color: colors.bg,
                    fontSize: fontSize.base,
                    fontWeight: 700,
                    borderBottom: `3px solid ${colors.accent4}`
                  }}>
                    Time
                  </th>
                  <th style={{
                    padding: spacing.md,
                    textAlign: 'center',
                    color: colors.bg,
                    fontSize: fontSize.base,
                    fontWeight: 700,
                    borderBottom: `3px solid ${colors.accent4}`
                  }}>
                    Duration (hrs)
                  </th>
                  <th style={{
                    padding: spacing.md,
                    textAlign: 'left',
                    color: colors.bg,
                    fontSize: fontSize.base,
                    fontWeight: 700,
                    borderBottom: `3px solid ${colors.accent4}`
                  }}>
                    Activity
                  </th>
                  <th style={{
                    padding: spacing.md,
                    textAlign: 'left',
                    color: colors.bg,
                    fontSize: fontSize.base,
                    fontWeight: 700,
                    borderBottom: `3px solid ${colors.accent4}`
                  }}>
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                {RUNDOWN_DATA[selectedDay].map((item, idx) => (
                  <tr key={idx} style={{
                    backgroundColor: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                  }}>
                    <td style={{
                      padding: spacing.md,
                      color: colors.bg,
                      fontSize: fontSize.base,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      {item.time}
                    </td>
                    <td style={{
                      padding: spacing.md,
                      color: colors.bg,
                      fontSize: fontSize.base,
                      textAlign: 'center',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      {item.duration}
                    </td>
                    <td style={{
                      padding: spacing.md,
                      color: colors.bg,
                      fontSize: fontSize.base,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      {item.activity}
                    </td>
                    <td style={{
                      padding: spacing.md,
                      color: colors.bg,
                      fontSize: fontSize.base,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      {item.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div style={{ height: spacing.xl }} />
      </div>
      </div>
  );
}
