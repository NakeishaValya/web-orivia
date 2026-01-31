import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar, 
  faLocationDot, 
  faUsers, 
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/ui/Navbar.jsx';
import Button from '../../components/ui/Button';
import { TripCard } from '../../components/ui/Card.jsx';
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
  'Documentation',
  'Documentation',
  'Documentation',
  'Documentation',
  'Accommodation'
];

const PICKUP_POINTS = [
  'Orivia Agent Gambir, Jakarta',
  'Orivia Agent Pasteur, Bandung',
  'Komodo Airport, Labuan Bajo',
  'Soekarno Hatta Airport, Jakarta'
];

// Dummy trips data
const TRIP_DATA = [
  {
    id: 1,
    name: 'Komodo Island',
    description: 'Komodo Island, located in Indonesia eastern province of East Nusa Tenggara, is known for its stunning natural beauty and unique wildlife. The island is also home to a rich and vibrant local culture, which includes its own language, customs, and traditions. Here is some information about the local language and culture of Komodo Island and the surrounding area.',
    location: { state: 'East Nusa Tenggara', country: 'Indonesia' },
    date: { start_date: '2026-02-01', end_date: '2026-02-03' },
    price: 4575000,
    pax: 15,
    slotAvailable: 8,
    duration: { days: 2, nights: 1 },
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop',
    type: 'Island Exploration',
    destinationType: 'Island Exploration'
  }
];

// Images for the trip (show 4 images in gallery elsewhere)
const TRIP_IMAGES = [
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&h=600&fit=crop'
];

const monthNamesID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const formatISODate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = d.getDate();
  const month = monthNamesID[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatDateRange = (startIso, endIso) => {
  if (!startIso && !endIso) return '';
  if (startIso && endIso) return `${formatISODate(startIso)} - ${formatISODate(endIso)}`;
  return startIso ? formatISODate(startIso) : formatISODate(endIso);
};

const formatRupiah = (value) => {
  if (value == null) return '';
  try {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 2 }).format(Number(value));
  } catch (e) {
    return String(value);
  }
};

const formatDurationText = (duration) => {
  if (!duration) return '';
  const parts = [];
  if (typeof duration.days === 'number') parts.push(`${duration.days} Day`);
  if (typeof duration.nights === 'number') parts.push(`${duration.nights} Night`);
  return parts.join(' ');
};

export default function BookingPage() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const [isHover, setIsHover] = useState(false);
  const trip = TRIP_DATA && TRIP_DATA[0] ? TRIP_DATA[0] : null;

  const prevImage = () => {
    setImgIndex((i) => (i - 1 + TRIP_IMAGES.length) % TRIP_IMAGES.length);
  };

  const nextImage = () => {
    setImgIndex((i) => (i + 1) % TRIP_IMAGES.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current == null || touchEndX.current == null) return;
    const dx = touchStartX.current - touchEndX.current;
    const threshold = 50; // px
    if (dx > threshold) {
      nextImage();
    } else if (dx < -threshold) {
      prevImage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
      <div style={{
        minHeight: '100vh',
        backgroundImage: "url('https://images.unsplash.com/photo-1531168556467-80aace0d0144?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: 'cover',
        backgroundPosition: 'top-center',
        backgroundRepeat: 'no-repeat',
        fontFamily: fontFamily.base
      }}>
      <Navbar style={{ position: 'sticky', top: 0, left: 0, right: 0, zIndex: 60, backgroundColor: `${colors.bg}33`, backdropFilter: 'saturate(120%) blur(6px)', borderBottom: `1px solid ${colors.bg}20` }} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: spacing.lg
      }}>
        
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
              <div style={{ width: '100%', height: '100%', position: 'relative' }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
              >
              <img
                src={TRIP_IMAGES[imgIndex]}
                alt={`Labuan Bajo ${imgIndex + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />

              {/* Left Arrow */}
              <button
                aria-label="Previous image"
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  background: 'transparent',
                  color: colors.bg,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  }}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>

              {/* Right Arrow */}
              <button
                aria-label="Next image"
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  background: 'transparent',
                  color: colors.bg,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>

              {/* Hover overlay for first image */}
              {imgIndex === 0 && isHover && (
                <div aria-hidden style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  padding: `${spacing.md}`,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  pointerEvents: 'none',
                  zIndex: 1
                }}>
                  <div style={{ fontSize: fontSize.lg, fontWeight: 700, marginBottom: spacing.xs, paddingLeft: spacing.lg }}>{trip ? trip.name : 'About this place'}</div>
                  <div style={{ fontSize: fontSize.base, textAlign: 'justify', padding: `${spacing.md} ${spacing.lg} ${spacing.lg} ${spacing.lg}`, lineHeight: 1.45, maxHeight: '40%', overflowY: 'auto' }}>{trip ? trip.description : ''}</div>
                </div>
              )}

              {imgIndex >= 1 && isHover && (
                <div aria-hidden style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  padding: `${spacing.md}`,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  pointerEvents: 'none',
                  zIndex: 1
                }}>
                </div>
              )}

            </div>
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
                  {(() => {
                    if (!trip) return '2 Day 1 Night • Island Exploration';
                    const durStr = formatDurationText(trip.duration);
                    const subtitle = [durStr, trip.destinationType || trip.type].filter(Boolean).join(' • ');
                    return subtitle;
                  })()}
                </p>
              </div>

              <div style={{ minWidth: 220, maxWidth: 300 }}>
                <div style={{
                  padding: spacing.lg,
                  borderRadius: radius.lg,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    fontSize: fontSize.sm,
                    color: colors.accent5,
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
                    {formatRupiah(trip.price)}<span style={{ fontSize: fontSize.lg, fontWeight: 600 }}>/pax</span>
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
              <TripCard style={{
                padding: spacing.lg
              }}>
                <h3 style={{
                  fontSize: fontSize.xl,
                  fontWeight: 700,
                  marginBottom: spacing.md,
                  fontFamily: fontFamily.base,
                  color: colors.accent5
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, fontSize: fontSize.base }}>
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>{trip ? formatDateRange(trip.date.start_date, trip.date.end_date) : formatDateRange('2026-02-01','2026-02-02')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, fontSize: fontSize.base }}>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <span>{trip ? `${trip.location.state}, ${trip.location.country}` : 'East Nusa Tenggara, Indonesia'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, fontSize: fontSize.base }}>
                    <FontAwesomeIcon icon={faUsers} />
                    <span>{trip ? `${trip.slotAvailable}/${trip.pax} Slots Available` : '8/15 Slots Available'}</span>
                  </div>
                </div>
              </TripCard>

              {/* 2.4 Include Card (Right Side - Spans 2 Rows) */}
              <TripCard style={{
                padding: spacing.md,
                gridRow: 'span 2',
                alignSelf: 'stretch',
                height: '100%',
                boxSizing: 'border-box'
              }}>
                <h3 style={{
                  fontSize: fontSize.xl,
                  fontWeight: 700,
                  marginBottom: spacing.md,
                  fontFamily: fontFamily.base,
                  color: colors.accent5
                }}>
                  Include
                </h3>
                <div className="custom-scrollbar" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.sm,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  paddingRight: spacing.sm,
                  boxSizing: 'border-box'
                }}>
                  {(trip && trip.includes ? trip.includes : INCLUDES).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, fontSize: fontSize.base }}>
                      <FontAwesomeIcon icon={faCheck} style={{ width: 16 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </TripCard>

              {/* 2.3 Pick-Up Point Card (Bottom Left) */}
              <TripCard style={{
                padding: spacing.lg
              }}>
                <h3 style={{
                  fontSize: fontSize.xl,
                  fontWeight: 700,
                  marginBottom: spacing.md,
                  fontFamily: fontFamily.base,
                  color: colors.accent5
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
                  {(trip && trip.pickup_points ? trip.pickup_points : PICKUP_POINTS).map((point, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, fontSize: fontSize.base }}>
                      <FontAwesomeIcon icon={faLocationDot} style={{ width: 16 }} />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </TripCard>

            </div>
          </div>
        </div>

        {/* Rundown Section */}
        <div>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 800,
            color: colors.bg,
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
