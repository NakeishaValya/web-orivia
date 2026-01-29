import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faCalendar, faUsers, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/ui/Navbar.jsx';
import Button from '../../components/ui/Button';
import { GridTripCard } from '../../components/ui/Card.jsx';
import { colors, spacing, radius, fontSize, fontFamily } from '../../styles/variables';

// Sample trip data
const TRIP_DATA = [
  {
    id: 1,
    name: '2D1N - Komodo Island',
    location: 'East Nusa Tenggara, Indonesia',
    date: '1 - 3 February 2026',
    price: 'Rp4.575.000,00',
    pax: 15,
    duration: { days: 2, nights: 1 },
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop',
    type: 'Island Exploration'
  },
  {
    id: 2,
    name: '3D2N - Raja Ampat',
    location: 'Maluku, Indonesia',
    date: '1 - 3 February 2026',
    price: 'Rp4.175.000,00',
    pax: 15,
    duration: { days: 3, nights: 2 },
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&h=300&fit=crop',
    type: 'Island Exploration'
  },
  {
    id: 3,
    name: '4D3N - Lake Toba',
    location: 'North Sumatra, Indonesia',
    date: '1 - 3 February 2026',
    price: 'Rp4.575.000,00',
    pax: 15,
    duration: { days: 4, nights: 3 },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    type: 'City Tour'
  },
  {
    id: 4,
    name: '3D2N - Bromo Tengger',
    location: 'East Java, Indonesia',
    date: '5 - 7 February 2026',
    price: 'Rp3.250.000,00',
    pax: 12,
    duration: { days: 3, nights: 2 },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    type: 'Mount Hiking'
  },
  {
    id: 5,
    name: '2D1N - Belitung Island',
    location: 'Bangka Belitung, Indonesia',
    date: '10 - 12 February 2026',
    price: 'Rp2.800.000,00',
    pax: 20,
    duration: { days: 2, nights: 1 },
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop',
    type: 'Island Exploration'
  },
  {
    id: 6,
    name: '5D4N - Wakatobi Diving',
    location: 'Southeast Sulawesi, Indonesia',
    date: '15 - 19 February 2026',
    price: 'Rp6.500.000,00',
    pax: 10,
    duration: { days: 5, nights: 4 },
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&h=300&fit=crop',
    type: 'Wildlife Exploration'
  }
];

const DESTINATION_TYPES = [
  'Island Exploration',
  'Mount Hiking',
  'Camping Ground',
  'City Tour',
  'Wildlife Exploration'
];

export default function CustomerExplorePage() {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState([1000000, 3500000]);
  const [selectedTypes, setSelectedTypes] = useState(['Island Exploration']);
  const [selectedDays, setSelectedDays] = useState(2);
  const [selectedNights, setSelectedNights] = useState(3);
  const [startDate, setStartDate] = useState('2026-02-02');
  const [endDate, setEndDate] = useState('2026-02-05');
  const [location, setLocation] = useState('Indonesia');
  const [pax, setPax] = useState(2);

  const handleTypeToggle = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const formatPrice = (price) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.accent1,
      backgroundImage: 'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&h=900&fit=crop)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      fontFamily: fontFamily.base
    }}>
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Container */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: spacing.lg,
        display: 'grid',
        gridTemplateColumns: '290px 1fr',
        gap: spacing.xl,
        alignItems: 'start'
      }}>
        
        {/* LEFT PANEL - Filter Section (Fixed) */}
        <div style={{
          position: 'sticky',
          top: '100px',
          backgroundColor: 'rgba(85, 87, 62, 0.95)',
          borderRadius: radius.lg,
          padding: spacing.lg,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Price Range */}
          <div style={{ marginBottom: spacing.xl }}>
            <h3 style={{ 
              color: colors.bg, 
              fontSize: fontSize.lg, 
              fontWeight: 700,
              marginBottom: spacing.md,
              fontFamily: fontFamily.base
            }}>
              Price Range
            </h3>
            <input
              type="range"
              min="500000"
              max="10000000"
              step="100000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              style={{
                width: '100%',
                marginBottom: spacing.sm,
                accentColor: colors.accent3
              }}
            />
            <input
              type="range"
              min="500000"
              max="10000000"
              step="100000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              style={{
                width: '100%',
                marginBottom: spacing.sm,
                accentColor: colors.accent3
              }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              color: colors.bg,
              fontSize: fontSize.sm,
              fontWeight: 600
            }}>
              <span>{formatPrice(priceRange[0])}</span>
              <span>-</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>

          {/* Destination Type */}
          <div style={{ marginBottom: spacing.xl }}>
            <h3 style={{ 
              color: colors.bg, 
              fontSize: fontSize.lg, 
              fontWeight: 700,
              marginBottom: spacing.md,
              fontFamily: fontFamily.base
            }}>
              Destination Type
            </h3>
            {DESTINATION_TYPES.map(type => (
              <label key={type} style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                marginBottom: spacing.sm,
                cursor: 'pointer',
                color: colors.bg,
                fontSize: fontSize.sm
              }}>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeToggle(type)}
                  style={{
                    width: 18,
                    height: 18,
                    cursor: 'pointer',
                    accentColor: colors.accent3
                  }}
                />
                {type}
              </label>
            ))}
          </div>

          {/* Duration */}
          <div>
            <h3 style={{ 
              color: colors.bg, 
              fontSize: fontSize.lg, 
              fontWeight: 700,
              marginBottom: spacing.md,
              fontFamily: fontFamily.base
            }}>
              Duration
            </h3>
            <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
              <div style={{
                backgroundColor: colors.error,
                color: colors.bg,
                padding: `${spacing.xs} ${spacing.md}`,
                borderRadius: radius.md,
                fontSize: fontSize.sm,
                fontWeight: 600
              }}>
                Day : {selectedDays}
              </div>
              <div style={{
                backgroundColor: colors.accent3,
                color: colors.bg,
                padding: `${spacing.xs} ${spacing.md}`,
                borderRadius: radius.md,
                fontSize: fontSize.sm,
                fontWeight: 600
              }}>
                Night : {selectedNights}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          
          {/* SEARCH SECTION (Sticky) */}
          <div style={{
            position: 'sticky',
            top: '100px',
            zIndex: 50,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: radius.lg,
            padding: spacing.lg,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 120px',
              gap: spacing.md,
              marginBottom: spacing.md
            }}>
              {/* Start Date */}
              <div style={{
                backgroundColor: colors.accent3,
                padding: spacing.md,
                borderRadius: radius.md,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.xs
              }}>
                <label style={{ fontSize: fontSize.xs, color: colors.bg, fontWeight: 600 }}>
                  Start Date
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <FontAwesomeIcon icon={faCalendar} color={colors.bg} />
                  <span style={{ color: colors.bg, fontSize: fontSize.sm, fontWeight: 700 }}>
                    Fri, 02 Feb
                  </span>
                </div>
              </div>

              {/* End Date */}
              <div style={{
                backgroundColor: colors.accent3,
                padding: spacing.md,
                borderRadius: radius.md,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.xs
              }}>
                <label style={{ fontSize: fontSize.xs, color: colors.bg, fontWeight: 600 }}>
                  End Date
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <FontAwesomeIcon icon={faCalendar} color={colors.bg} />
                  <span style={{ color: colors.bg, fontSize: fontSize.sm, fontWeight: 700 }}>
                    Mon, 05 Feb
                  </span>
                </div>
              </div>

              {/* Location */}
              <div style={{
                backgroundColor: colors.accent3,
                padding: spacing.md,
                borderRadius: radius.md,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.xs
              }}>
                <label style={{ fontSize: fontSize.xs, color: colors.bg, fontWeight: 600 }}>
                  Location
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <FontAwesomeIcon icon={faLocationDot} color={colors.bg} />
                  <span style={{ color: colors.bg, fontSize: fontSize.sm, fontWeight: 700 }}>
                    Indonesia
                  </span>
                </div>
              </div>

              {/* Pax */}
              <div style={{
                backgroundColor: colors.accent3,
                padding: spacing.md,
                borderRadius: radius.md,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.xs
              }}>
                <label style={{ fontSize: fontSize.xs, color: colors.bg, fontWeight: 600 }}>
                  Pax
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <FontAwesomeIcon icon={faUsers} color={colors.bg} />
                  <span style={{ color: colors.bg, fontSize: fontSize.sm, fontWeight: 700 }}>
                    {pax}
                  </span>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button style={{
              width: '100%',
              backgroundColor: colors.accent5,
              color: colors.bg,
              padding: spacing.md,
              borderRadius: radius.md,
              border: 'none',
              fontSize: fontSize.base,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              transition: 'all 0.3s ease',
              fontFamily: fontFamily.base
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.accent4}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.accent5}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              Search Trip
            </button>
          </div>

          {/* CARD GRID SECTION (Scrollable) */}
          <div style={{
            maxHeight: 'calc(100vh - 380px)',
            overflowY: 'auto',
            paddingRight: spacing.sm,
            paddingTop: spacing.md,
            scrollbarWidth: 'thin',
            scrollbarColor: `${colors.accent4} transparent`
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: spacing.lg
            }}>
              {TRIP_DATA.map(trip => (
                <GridTripCard
                  key={trip.id}
                  trip={trip}
                  onClick={() => { if (trip.id === 1) navigate('/explore/booking'); }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
