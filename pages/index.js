import Head from 'next/head';
import { getStore } from '@netlify/blobs';

const RANKS = [
  { badge: '#FFD700', badgeText: '#000', border: 'rgba(255,215,0,0.35)', glow: '0 0 24px rgba(255,215,0,0.2)' },
  { badge: '#A8A9AD', badgeText: '#000', border: 'rgba(168,169,173,0.35)', glow: '0 0 24px rgba(168,169,173,0.15)' },
  { badge: '#CD7F32', badgeText: '#fff', border: 'rgba(205,127,50,0.35)', glow: '0 0 24px rgba(205,127,50,0.15)' },
  { badge: '#1e4a1e', badgeText: '#fff', border: 'rgba(255,255,255,0.08)', glow: 'none' },
];

function getMondayOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatWeekRange(dateStr) {
  const monday = getMondayOfWeek(dateStr);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const opts = { day: 'numeric', month: 'short' };
  return `${monday.toLocaleDateString('en-GB', opts)} – ${sunday.toLocaleDateString('en-GB', opts)}`;
}

function formatUpdated(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export default function Leaderboard({ data }) {
  const sorted = data
    ? [...data.locations].sort((a, b) => b.weekly - a.weekly)
    : [];

  return (
    <>
      <Head>
        <title>GC4C Weekly Listings</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div style={{
        backgroundColor: '#0a1a0f',
        minHeight: '100vh',
        padding: '14px 16px',
        fontFamily: "'Inter', sans-serif",
        color: '#ffffff',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '24px', lineHeight: 1, marginBottom: '4px' }}>🏆</div>
            <h1 style={{
              fontSize: '15px',
              fontWeight: 900,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              margin: 0,
              color: '#ffffff',
            }}>
              Weekly Listings
            </h1>
            {data && (
              <p style={{
                margin: '6px 0 0',
                fontSize: '13px',
                color: '#6dab6d',
                letterSpacing: '0.03em',
              }}>
                Week of {formatWeekRange(data.updated)}
              </p>
            )}
          </div>

          {/* Leaderboard cards */}
          {data ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {sorted.map((loc, i) => {
                const rank = RANKS[i] || RANKS[3];
                return (
                  <div
                    key={loc.name}
                    style={{
                      backgroundColor: '#0d2318',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      border: `1px solid ${rank.border}`,
                      boxShadow: rank.glow,
                    }}
                  >
                    {/* Rank badge */}
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: rank.badge,
                      color: rank.badgeText,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '13px',
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>

                    {/* Location name */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 800,
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {loc.name}
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: '9px',
                          fontWeight: 600,
                          color: '#6dab6d',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          marginBottom: '2px',
                        }}>
                          This Week
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 900, lineHeight: 1, color: '#ffffff' }}>
                          {loc.weekly.toLocaleString()}
                        </div>
                      </div>

                      <div style={{ width: '1px', height: '30px', backgroundColor: '#2d5a2d' }} />

                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: '9px',
                          fontWeight: 600,
                          color: '#6dab6d',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          marginBottom: '2px',
                        }}>
                          Today
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 900, lineHeight: 1, color: '#ffffff' }}>
                          {loc.daily.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              color: '#4a7a4a',
              padding: '60px 20px',
              fontSize: '14px',
            }}>
              No data yet — check back after the first automated update.
            </div>
          )}

          {data && (
            <div style={{
              backgroundColor: '#0d2318',
              borderRadius: '10px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              marginTop: '6px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ flex: 1, fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Company Total
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', fontWeight: 600, color: '#6dab6d', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>
                    This Week
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 900, lineHeight: 1, color: '#ffffff' }}>
                    {sorted.reduce((sum, loc) => sum + loc.weekly, 0).toLocaleString()}
                  </div>
                </div>
                <div style={{ width: '1px', height: '30px', backgroundColor: '#2d5a2d' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', fontWeight: 600, color: '#6dab6d', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>
                    Today
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 900, lineHeight: 1, color: '#ffffff' }}>
                    {sorted.reduce((sum, loc) => sum + loc.daily, 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {data && (
            <div style={{
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '11px',
              color: '#3d6b3d',
              letterSpacing: '0.03em',
            }}>
              Last updated {formatUpdated(data.updated)}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const store = getStore('leaderboard');
    const data = await store.get('current', { type: 'json' });
    return { props: { data: data || null } };
  } catch {
    return { props: { data: null } };
  }
}
