import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faDownload, faCheck, faXmark, faEdit } from '@fortawesome/free-solid-svg-icons';
import { spacing, fontFamily, colors, radius, fontSize } from '../../styles/variables.jsx';
import Navbar, { TripTabs } from '../../components/ui/Navbar.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useLocation } from 'react-router-dom';
import { fetchBookingsByTrip, fetchPlannerTripDetail, confirmParticipant } from '../../services/tripService';


export default function ParticipantPage() {

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const qScheduleId = params.get('scheduleId');
  const qTripId = params.get('tripId');
  
  // State for API data
  const [loading, setLoading] = useState(!!qTripId);
  const [tripData, setTripData] = useState(null);
  const [participantsData, setParticipantsData] = useState([]);
  
  // Fetch trip and bookings data from API
  useEffect(() => {
    if (!qTripId) {
      setLoading(false);
      return;
    }
    
    async function loadData() {
      try {
        setLoading(true);
        // Fetch trip details and participant rows in parallel
        const [trip, participantRows] = await Promise.all([
          fetchPlannerTripDetail(qTripId),
          fetchBookingsByTrip(qTripId)
        ]);
        setTripData(trip);
        setParticipantsData(Array.isArray(participantRows) ? participantRows : []);
      } catch (err) {
        console.error('Error loading trip/bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
    const intervalId = setInterval(loadData, 15000);
    return () => clearInterval(intervalId);
  }, [qTripId]);

  const displayedTrip = tripData;

  const schedules = displayedTrip
    ? [{ id: qScheduleId || displayedTrip.tripId || displayedTrip.trip_id || qTripId, text: `${displayedTrip.startDate || ''} - ${displayedTrip.endDate || ''}` }]
    : [];
  const [selectedScheduleId, setSelectedScheduleId] = useState(qScheduleId || null);
  
  // Get pickup points array for lookup
  const pickupPointsArr = displayedTrip?.pickup_points ?? [];
  
  const pickupPointMap = pickupPointsArr.reduce((acc, pp) => {
    if (pp?.id) {
      acc[String(pp.id)] = pp;
    }
    return acc;
  }, {});

  // Map participants rows from open_trip_db participants table
  const apiPassengers = participantsData.map((participant) => {
    const pickupFromTrip = participant?.trip_pickup_id ? pickupPointMap[String(participant.trip_pickup_id)] : null;
    const pickupLocation = participant?.pick_up_point || pickupFromTrip?.location || '';
    return {
      booking_id: participant?.booking_id || '',
      booking_status: participant?.booking_status || '',
      username: participant?.participant_id ? String(participant.participant_id).slice(0, 8) : '',
      fullname: `${participant?.first_name || ''} ${participant?.last_name || ''}`.trim(),
      gender: participant?.gender || '',
      dob: participant?.date_of_birth || null,
      nationality: participant?.nationality || '',
      pickup: pickupLocation,
      phone: participant?.phone_number || '',
      notes: participant?.notes || '',
      pickupPrice: Number(pickupFromTrip?.price || 0) || 0,
      participant_id: participant?.participant_id || '',
      is_confirmed: Boolean(participant?.is_confirmed || false),
    };
  });

  const passengerSample = apiPassengers;
  const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

  // Computed participant and capacity values from API data.
  const totalParticipants = passengerSample.length;
  const confirmedParticipants = passengerSample.filter((p) => Boolean(p.is_confirmed));
  const confirmedCountComputed = confirmedParticipants.length;
  const capacity = typeof displayedTrip?.slot === 'number' ? displayedTrip.slot : (typeof displayedTrip?.pax === 'number' ? displayedTrip.pax : undefined);
  const availableSlots = (typeof capacity === 'number') ? Math.max(capacity - totalParticipants, 0) : undefined;

  // pickup summary computed from trip pickup_points (from trip_pickup_point table in database)
  const normalize = (s) => String(s || '').trim();
  
  // Count passengers by pickup location (only counting those matching official pickup points)
  const pickupCountsMap = {};
  passengerSample.forEach(p => {
    const loc = normalize(p.pickup || '');
    if (loc) {
      pickupCountsMap[loc] = (pickupCountsMap[loc] || 0) + 1;
    }
  });

  // Build summary using ONLY official pickup points from trip_pickup_point table
  const pickupSummary = pickupPointsArr.map(pp => {
    const key = normalize(pp.location);
    const parsedPrice = Number(pp.price || 0);
    return {
      loc: pp.location || '',
      count: pickupCountsMap[key] || 0,
      price: Number.isFinite(parsedPrice) ? parsedPrice : 0
    };
  });

  const tripPrice = typeof displayedTrip?.price === 'number' ? displayedTrip.price : (typeof displayedTrip?.harga === 'number' ? displayedTrip.harga : undefined);
  const totalTripRevenue = (typeof tripPrice === 'number') ? tripPrice * totalParticipants : undefined;
  const totalRevenue = (typeof totalTripRevenue === 'number') ? totalTripRevenue : undefined;

  const formatIDR = (v) => {
    if (typeof v !== 'number') return '-';
    return 'IDR ' + v.toLocaleString('id-ID');
  };

  const formatISODate = (iso) => {
    if (!iso) return iso;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const day = d.getDate();
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };
  const formatDateRange = (text) => {
    if (!text || typeof text !== 'string') return text;
    const m = text.match(/(\d{4}-\d{2}-\d{2})\s*-\s*(\d{4}-\d{2}-\d{2})/);
    if (m) return `${formatISODate(m[1])} - ${formatISODate(m[2])}`;
    return text;
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);

  const openPassengerModal = (p) => {
    setSelectedPassenger(p);
    setModalOpen(true);
  };

  const closePassengerModal = () => {
    setSelectedPassenger(null);
    setModalOpen(false);
  };

  const handleConfirmSelectedPassenger = async () => {
    if (!selectedPassenger?.participant_id || selectedPassenger?.is_confirmed) return;

    try {
      await confirmParticipant(selectedPassenger.participant_id);

      setParticipantsData((prev) => prev.map((row) => {
        if (String(row?.participant_id) === String(selectedPassenger.participant_id)) {
          return { ...row, is_confirmed: true };
        }
        return row;
      }));

      setSelectedPassenger((prev) => {
        if (!prev) return prev;
        return { ...prev, is_confirmed: true };
      });
    } catch (err) {
      console.error('Failed to confirm participant:', err);
    }
  };

  const calculateAge = (dobStr) => {
    if (!dobStr) return '-';
    const d = new Date(dobStr);
    if (isNaN(d)) return '-';
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age;
  };

  const downloadCSV = (rows) => {
    if (!rows || !rows.length) return;
    const headers = ['Username', 'Full Name', 'Gender', 'Age', 'Pick Up Point', 'Phone Number'];
    const csvRows = [headers.join(',')];
    rows.forEach((r) => {
      const vals = [
        r.username,
        r.fullname,
        r.gender,
        calculateAge(r.dob),
        r.pickup,
        r.phone,
      ];
      const escaped = vals.map((v) => `"${String(v).replace(/"/g, '""')}"`);
      csvRows.push(escaped.join(','));
    });
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passengers.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const page = {
    height: '100vh',
    overflow: 'hidden',    
    fontFamily: fontFamily?.base || 'Inter, system-ui, -apple-system',
    backgroundImage: 'url("https://images.unsplash.com/photo-1584715625116-c1dbbfcf19be?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    backgroundColor: colors.bg,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat',
    paddingBottom: spacing.xl
  };

  const container = {
    maxWidth: 1400,
    margin: '0 auto',
    padding: spacing.lg
  };

  const header = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md
  };

  const headerLeft = {
    display: 'flex',
    alignItems: 'stretch',
    gap: spacing.md
  };

  const thumb = {
    width: 100.8,
    height: 100.8,
    borderRadius: radius.md,
    objectFit: 'cover',
    boxShadow: '0 6px 18px rgba(8,15,20,0.06)'
  };

  const titleBlock = { display: 'flex', flexDirection: 'column' };
  const subtitle = { color: '#5b5b5b', fontSize: fontSize.sm, marginTop: spacing.sm };
  const slotBox = { textAlign: 'right' };
  const slotBig = { fontSize: fontSize.xl, fontWeight: 800, color: colors.accent5 };

  const card = {
    backgroundColor: colors.accent5,
    color: colors.bg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    boxShadow: '0 8px 30px rgba(8,15,20,0.08)'
  };

  const sectionsStack = { display: 'flex', flexDirection: 'column', gap: spacing.lg, marginBottom: spacing.lg };
  const smallCard = { background: 'transparent', padding: spacing.sm, borderRadius: radius.md };
  const tableWrap = { marginTop: spacing.md, overflowX: 'auto' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: fontSize.sm, tableLayout: 'fixed' };
  const passengerCard = { backgroundColor: colors.bg, color: colors.text, borderRadius: radius.md, padding: spacing.lg, boxShadow: '0 6px 18px rgba(8,15,20,0.06)' };
  const passengerTableStyle = { ...tableStyle, color: colors.text, wordBreak: 'break-word' };
  const gridStyle = { display: 'grid', gridTemplateColumns: '380px 1fr', gap: spacing.lg, marginTop: spacing.lg };
  passengerCard.display = 'flex';
  passengerCard.flexDirection = 'column';
  passengerCard.flex = 1;
  tableWrap.flex = 1;
  tableWrap.overflowY = 'auto';

  return (
    <div style={page}>
      <Navbar style={{ position: 'sticky', top: 0, left: 0, right: 0, zIndex: 60, backgroundColor: `${colors.bg}33`, backdropFilter: 'saturate(120%) blur(6px)', borderBottom: `1px solid ${colors.bg}20` }} />
      <main style={container}>
        <TripTabs />

        <div style={header}>
          {loading ? (
            <>
              <div style={headerLeft}>
                <div style={{ ...thumb, backgroundColor: '#eee' }} />
                <div style={titleBlock}>
                  <div style={{ height: 22, width: 220, background: '#eee', borderRadius: 6 }} />
                  <div style={{ height: 14, width: 160, background: '#eee', borderRadius: 6, marginTop: spacing.sm }} />
                </div>
              </div>
              <div style={slotBox}>
                <div style={{ height: 18, width: 120, background: '#eee', borderRadius: 6 }} />
                <div style={{ height: 28, width: 80, background: '#eee', borderRadius: 6, marginTop: spacing.sm }} />
              </div>
            </>
          ) : (
            <>
              <div style={headerLeft}>
                {displayedTrip && (displayedTrip.image || (displayedTrip.images && displayedTrip.images[0])) ? (
                  <img src={displayedTrip.image || (displayedTrip.images && displayedTrip.images[0])} alt="trip" style={thumb} />
                ) : null}
                <div style={titleBlock}>
                  <h2 style={{ margin: 0, color: '#2b2b2b' }}>{displayedTrip ? (displayedTrip.trip_name || displayedTrip.nama || displayedTrip.name || '') : ''}</h2>
                  <div style={subtitle}>
                    {displayedTrip ? ((typeof displayedTrip.location === 'string' ? displayedTrip.location : displayedTrip?.location?.state) || displayedTrip?.provinsi || '') : ''}
                    {displayedTrip && (displayedTrip?.duration?.days || displayedTrip?.jumlah_hari || displayedTrip?.duration?.nights || displayedTrip?.jumlah_malam || displayedTrip?.destination_type || displayedTrip?.type || displayedTrip?.destinationType) ? ' · ' : ''}
                    {displayedTrip ? (displayedTrip?.duration?.days || displayedTrip?.jumlah_hari ? `${displayedTrip.duration?.days || displayedTrip.jumlah_hari}D` : '') : ''}
                    {displayedTrip ? (displayedTrip?.duration?.nights || displayedTrip?.jumlah_malam ? `${displayedTrip.duration?.nights || displayedTrip.jumlah_malam}N` : '') : ''}
                    {displayedTrip ? (displayedTrip?.destination_type || displayedTrip?.type || displayedTrip?.destinationType ? ` · ${displayedTrip.destination_type || displayedTrip.type || displayedTrip.destinationType}` : '') : ''}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.sm }}>
                    {schedules.length > 0 && (
                      <select
                        value={selectedScheduleId || ''}
                        onChange={(e) => setSelectedScheduleId(e.target.value)}
                        style={{ padding: `${spacing.xs} ${spacing.sm}`, borderRadius: radius.sm, border: `1px solid ${colors.accent5}20`, backgroundColor: colors.accent1, cursor: 'pointer' }}
                      >
                        {schedules.map(s => (
                          <option key={s.id} value={s.id}>{formatDateRange(s.text)}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
              <div style={slotBox}>
                {typeof capacity === 'number' && (
                  <>
                    <div style={{ color: '#7a6a45', fontWeight: 600 }}>Available Slot</div>
                    <div style={slotBig}>{availableSlots} / {capacity}</div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <Modal open={modalOpen} onClose={closePassengerModal} title={''}>
          {selectedPassenger && (
            <>
              <div style={{ backgroundColor: '#ffffff', borderRadius: radius.md, padding: spacing.md, boxShadow: '0 6px 18px rgba(8,15,20,0.06)', color: colors.accent5 }}>
                  <div style={{ fontSize: fontSize.xl, fontWeight: 700, marginBottom: spacing.sm, color: colors.accent5 }}>Booking Details</div>
                  <div style={{ marginBottom: spacing.md }}>
                    <div style={{ fontSize: fontSize.sm, opacity: 0.9 }}>Username</div>
                    <div style={{ fontWeight: 700, marginBottom: spacing.xs }}>@{selectedPassenger.username}</div>
                  </div>
                
                <div style={{ marginBottom: spacing.md }}>
                  <div style={{ display: 'flex', gap: spacing.lg, flexWrap: 'nowrap', overflowX: 'auto' }}>
                    <div style={{ flex: '2 1 0', minWidth: 0 }}>
                      <div style={{ fontSize: fontSize.sm, opacity: 0.9 }}>Name</div>
                      <div style={{ fontWeight: 600 }}>{selectedPassenger.fullname}</div>
                    </div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}>
                      <div style={{ fontSize: fontSize.sm, opacity: 0.9 }}>Phone Number</div>
                      <div style={{ fontWeight: 600 }}>{selectedPassenger.phone}</div>
                    </div>
                    <div style={{ flex: '0.6 1 0', minWidth: 0 }}>
                      <div style={{ fontSize: fontSize.sm, opacity: 0.9 }}>Gender</div>
                      <div style={{ fontWeight: 600 }}>{selectedPassenger.gender}</div>
                    </div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}>
                      <div style={{ fontSize: fontSize.sm, opacity: 0.9 }}>Date of Birth</div>
                      <div style={{ fontWeight: 600 }}>{selectedPassenger.dob}</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: spacing.md }}>
                  <div style={{ fontSize: fontSize.sm, opacity: 0.9, marginBottom: spacing.xs }}>Notes</div>
                  <div style={{ borderRadius: radius.sm, color: colors.accent5, fontWeight: 600 }}>
                    {selectedPassenger.notes || 'No notes available'}
                  </div>
                </div>

                <div style={{ marginBottom: spacing.md }}>
                  <div style={{ fontSize: fontSize.sm, opacity: 0.9 }}>Pick Up Point</div>
                  <div style={{ fontWeight: 600 }}>{selectedPassenger.pickup}</div>
                </div>
              </div>
              
              <div style={{padding: spacing.md, paddingLeft: spacing.sm, marginTop: spacing.sm, display: 'flex', justifyContent: 'flex-start', gap: spacing.sm }}>
                <div style={{ display: 'flex', gap: spacing.sm }}>
                  <Button variant="btn1" style={{ display: 'inline-flex', gap: spacing.xs }}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </Button>
                  <Button
                    variant={selectedPassenger?.is_confirmed ? 'btn1' : 'btn2'}
                    style={{ display: 'inline-flex', gap: spacing.xs }}
                    onClick={handleConfirmSelectedPassenger}
                    disabled={selectedPassenger?.is_confirmed}
                  >
                    <FontAwesomeIcon icon={faCheck} /> {selectedPassenger?.is_confirmed ? 'Confirmed' : 'Confirm'}
                  </Button>
                  <Button variant="btn3" onClick={closePassengerModal} style={{ display: 'inline-flex', gap: spacing.xs }}>
                    <FontAwesomeIcon icon={faXmark} /> Cancel
                  </Button>
                </div>
              </div>
            </>
          )}
        </Modal>
          {/* Side-by-side layout: left summary (fixed width) and right passenger list (fills remaining width) */}
        <div style={{ display: 'flex', gap: spacing.lg, marginTop: spacing.lg, alignItems: 'stretch' }}>
          <div style={{ width: 380, flex: '0 0 380px', display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            <div className="left-panel-fixed custom-scrollbar" style={card}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
                <div style={smallCard}>
                  <h3 style={{ marginTop: 0, marginBottom: spacing.sm }}>Participant Summary</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                      <div>Total Participant : {totalParticipants}</div>
                      <div>Confirmed : {confirmedCountComputed}</div>
                      {typeof capacity === 'number' && <div>Available Slots : {availableSlots}</div>}
                    </div>
                </div>

                <div style={smallCard}>
                  <h3 style={{ marginTop: 0, marginBottom: spacing.sm }}>Pick Up Point Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                          {displayedTrip && pickupSummary.length > 0 ? pickupSummary.map(p => (
                            <div key={p.loc}>{p.loc} : {p.count}</div>
                          )) : <div style={{ color: '#999' }}>Pickup summary unavailable</div>}
                        </div>
                </div>

                <div style={smallCard}>
                  <h3 style={{ marginTop: 0, marginBottom: spacing.sm }}>Financial Summary</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    {typeof totalTripRevenue === 'number' && <div>Total Trip Revenue : {formatIDR(totalTripRevenue)}</div>}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: spacing.xs }}>
              <Button
                variant="primary"
                onClick={() => downloadCSV(passengerSample)}
                style={{ padding: `${spacing.sm} ${spacing.md}`, width: '100%' }}
              >
                <FontAwesomeIcon icon={faDownload} style={{ marginRight: spacing.xs }} />
                Download
              </Button>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={passengerCard}>
              <h3 style={{ marginTop: 0, marginBottom: spacing.sm, color: colors.accent5 }}>Passenger List</h3>
              <div style={{ ...tableWrap, minHeight: '420px', maxHeight: passengerSample.length > 10 ? '420px' : undefined }}>
                <table style={passengerTableStyle}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr style={{ textAlign: 'center', borderBottom: `1px solid ${colors.accent5}22`, backgroundColor: colors.accent5 }}>
                      <th style={{ padding: spacing.sm, color: colors.bg, width: '11%', textAlign: 'center' }}>Username</th>
                      <th style={{ padding: spacing.sm, color: colors.bg, width: '25%', textAlign: 'center' }}>Full Name</th>
                      <th style={{ padding: spacing.sm, color: colors.bg, width: '10%', textAlign: 'center' }}>Gender</th>
                      <th style={{ padding: spacing.sm, color: colors.bg, width: '7%', textAlign: 'center' }}>Age</th>
                      <th style={{ padding: spacing.sm, color: colors.bg, width: '28%', textAlign: 'center'}}>Pick Up Point</th>
                      <th style={{ padding: spacing.sm, color: colors.bg, width: '14%' }}>Phone Number</th>
                      <th style={{ padding: spacing.sm, color: colors.bg, width: '8%', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} style={{ padding: spacing.lg, textAlign: 'center', color: colors.accent5, fontWeight: 600 }}>
                          Loading participants...
                        </td>
                      </tr>
                    ) : passengerSample.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: spacing.lg, textAlign: 'center', color: colors.accent5, fontWeight: 600 }}>
                          No Participant Joined
                        </td>
                      </tr>
                    ) : (
                      passengerSample.map((p, idx) => (
                        <tr key={idx} style={{ borderBottom: `1px solid ${colors.accent5}11` }}>
                          <td style={{ padding: spacing.sm }}>{p.username}</td>
                          <td style={{ padding: spacing.sm }}>{p.fullname}</td>
                          <td style={{ padding: spacing.sm }}>{p.gender}</td>
                          <td style={{ padding: spacing.sm }}>{p.dob ? `${calculateAge(p.dob)} yrs` : ''}</td>
                          <td style={{ padding: spacing.sm }}>{p.pickup}</td>
                          <td style={{ padding: spacing.sm }}>{p.phone}</td>
                          <td style={{ padding: spacing.sm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <button onClick={() => openPassengerModal(p)} style={{ background: 'transparent', border: 'none', color: colors.accent5, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} title="View">
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              </div>
          </div>
        </div>
        
      </main>
    </div>
  );
}