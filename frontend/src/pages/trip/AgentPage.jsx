import React from 'react';
import {
  colors,
  spacing,
  radius,
  fontSize,
  transitions,
  fontFamily,
} from '../../styles/variables.jsx';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faTag } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/ui/Navbar.jsx';
import Button from '../../components/ui/Button.jsx';
import { StyledTripCard, GridTripCard } from '../../components/ui/Card.jsx';
import tripExploreBg from '../../assets/images/tripexplorebg.png';

export default function AgentTripPage() {
  const navigate = useNavigate();

  const dummyTrips = [
    {
      title: 'Banda Neira',
      duration: { days: 2, nights: 3 },
      location: { state: 'Maluku', country: 'Indonesia' },
      price: 4575000,
      date: [
        { start_date: '2026-02-01', end_date: '2026-02-02' },
        { start_date: '2026-03-01', end_date: '2026-03-03' },
      ],
      pax: '15',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=60',
      destinationType: 'Island Exploration',
    },
    {
      title: 'Labuan Bajo',
      duration: { days: 2, nights: 1 },
      location: { state: 'East Nusa Tenggara', country: 'Indonesia' },
      price: 4575000,
      date: [ { start_date: '2026-03-10', end_date: '2026-03-11' } ],
      pax: '15',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=60',
      destinationType: 'Island Exploration',
    },
    {
      title: 'Raja Ampat',
      duration: { days: 3, nights: 2 },
      location: { state: 'Maluku', country: 'Indonesia' },
      price: 4575000,
      date: [
        { start_date: '2026-04-01', end_date: '2026-04-03' },
        { start_date: '2026-06-10', end_date: '2026-06-12' },
      ],
      pax: '15',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=60',
      destinationType: 'Island Exploration',
    },
    {
      title: 'Lake Toba',
      duration: { days: 4, nights: 3 },
      location: { state: 'North Sumatra', country: 'Indonesia' },
      price: 4575000,
      date: [
        { start_date: '2026-05-05', end_date: '2026-05-08' },
        { start_date: '2026-09-01', end_date: '2026-09-04' },
      ],
      pax: '15',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=60',
      destinationType: 'City Tour',
    },
    {
      title: 'Merbabu',
      duration: { days: 2, nights: 1 },
      location: { state: 'Central Java', country: 'Indonesia' },
      price: 1500000,
      date: [
        { start_date: '2026-06-12', end_date: '2026-06-13' },
        { start_date: '2026-10-05', end_date: '2026-10-06' },
      ],
      pax: '15 pax',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=60',
      destinationType: 'Mount Hiking',
    },
    {
      title: 'Carstensz Pyramid',
      duration: { days: 5, nights: 6 },
      location: { state: 'Central Papua', country: 'Indonesia' },
      price: 20000000,
      date: [
        { start_date: '2026-07-01', end_date: '2026-07-05' },
        { start_date: '2026-11-01', end_date: '2026-11-05' },
      ],
      pax: '15 pax',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=60',
      destinationType: 'Mount Hiking',
    },
    {
      title: 'Kerinci',
      duration: { days: 3, nights: 2 },
      location: { state: 'West Sumatra', country: 'Indonesia' },
      price: 2240000,
      date: [ { start_date: '2026-08-20', end_date: '2026-08-22' } ],
      pax: '15 pax',
      image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1600&q=60',
      destinationType: 'Mount Hiking',
    },
    {
      title: 'Kawah Ijen',
      duration: { days: 2, nights: 1 },
      location: { state: 'East Java', country: 'Indonesia' },
      price: 4575000,
      date: [ { start_date: '2026-09-10', end_date: '2026-09-11' } ],
      pax: '15 pax',
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=60',
      destinationType: 'Mount Hiking',
    },
  ];

  const styles = {
    page: {
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#1A1F1D',
      backgroundImage: 'url(https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=90&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      fontFamily: fontFamily?.base || 'inherit',
    },
    main: {
      padding: 24,
      maxWidth: '1326px',
      boxSizing: 'border-box',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 32px)',
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      width: '100%',
      maxWidth: '1278px',
      boxSizing: 'border-box',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    title: {
      margin: 0,
      fontSize: 36,
      fontWeight: 800,
      color: colors.accent5,
      letterSpacing: '0.2px'
    },
    subtitle: {
      margin: '6px 0 0 0',
      color: colors.accent5 ,
      fontSize: 16,
      fontWeight: 600,
      opacity: 0.95
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))',
      gap: 12,
      width: '100%',
      boxSizing: 'border-box',
    },
    // Card-specific inline styles removed — visuals come from centralized Card.jsx
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Trips</h1>
            <p style={styles.subtitle}>Manage your trips and packages</p>
          </div>
          <div>
            <Button
              variant="primary"
              style={{minWidth: '200px', minHeight: '40.8px', fontSize: fontSize.xs }}
              onClick={() => navigate('/trip/new')}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span style={{ fontWeight: 500, fontFamily: fontFamily.base }}>Add New Trip</span>
            </Button>
          </div>
        </div>

        <div className="cards-scroll" style={{ flex: 1, overflowX: 'hidden' }}>
          <section style={{ ...styles.grid, width: '100%', overflow: 'visible', marginTop: spacing.md }}>
          {dummyTrips.map((trip, idx) => (
            <GridTripCard
              key={idx}
              trip={{
                ...trip,
                name: trip.title,
                duration: trip.duration
              }}
              onClick={trip.title === 'Banda Neira' ? () => navigate('/trip/edit') : undefined}
            />
          ))}
          </section>
        </div>
      </main>
    </div>
  );
}
