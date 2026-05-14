import { getStore } from '@netlify/blobs';

const LOCATIONS = ['Edinburgh', 'Warrington', 'Milton Keynes', 'Southampton'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, values } = req.body;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Wrong access code' });
  }

  const locations = LOCATIONS.map((name) => ({
    name,
    weekly: parseInt(values[`${name}_weekly`], 10) || 0,
    daily: parseInt(values[`${name}_daily`], 10) || 0,
  }));

  const store = getStore('leaderboard');
  await store.setJSON('current', {
    locations,
    updated: new Date().toISOString(),
  });

  return res.status(200).json({ ok: true });
}
