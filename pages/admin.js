import Head from 'next/head';
import { useState } from 'react';

const LOCATIONS = ['Edinburgh', 'Warrington', 'Milton Keynes', 'Southampton'];

const initialValues = () =>
  Object.fromEntries(
    LOCATIONS.flatMap((loc) => [
      [`${loc}_weekly`, ''],
      [`${loc}_daily`, ''],
    ])
  );

export default function Admin() {
  const [password, setPassword] = useState('');
  const [values, setValues] = useState(initialValues());
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const res = await fetch('/api/admin-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, values }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setStatus({ ok: true, message: 'Leaderboard updated!' });
    } else {
      setStatus({ ok: false, message: data.error || 'Something went wrong.' });
    }
  }

  return (
    <>
      <Head>
        <title>Update Leaderboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div style={{
        backgroundColor: '#112611',
        minHeight: '100vh',
        padding: '24px 20px',
        fontFamily: "'Inter', sans-serif",
        color: '#ffffff',
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>

          <h1 style={{
            fontSize: '18px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textAlign: 'center',
            marginBottom: '24px',
          }}>
            Update Leaderboard
          </h1>

          <form onSubmit={handleSubmit}>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Access Code</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
                placeholder="Enter access code"
              />
            </div>

            {/* Location rows */}
            {LOCATIONS.map((loc) => (
              <div key={loc} style={{
                backgroundColor: '#1a3d1a',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
              }}>
                <div style={{
                  fontWeight: 700,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#6dab6d',
                  marginBottom: '12px',
                }}>
                  {loc}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>This Week</label>
                    <input
                      type="number"
                      min="0"
                      value={values[`${loc}_weekly`]}
                      onChange={(e) => setValues({ ...values, [`${loc}_weekly`]: e.target.value })}
                      required
                      style={inputStyle}
                      placeholder="0"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Today</label>
                    <input
                      type="number"
                      min="0"
                      value={values[`${loc}_daily`]}
                      onChange={(e) => setValues({ ...values, [`${loc}_daily`]: e.target.value })}
                      required
                      style={inputStyle}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '14px',
                backgroundColor: loading ? '#2d5a2d' : '#2d7d2d',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Saving…' : 'Save'}
            </button>

            {status && (
              <div style={{
                marginTop: '14px',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: status.ok ? '#1a3d1a' : '#3d1a1a',
                color: status.ok ? '#6dab6d' : '#f87171',
                fontSize: '14px',
                fontWeight: 600,
                textAlign: 'center',
              }}>
                {status.message}
              </div>
            )}

          </form>
        </div>
      </div>
    </>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 600,
  color: '#6dab6d',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  backgroundColor: '#112611',
  border: '1px solid #2d5a2d',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 600,
  outline: 'none',
  boxSizing: 'border-box',
};
