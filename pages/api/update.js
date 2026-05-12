import { getStore } from '@netlify/blobs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = req.headers['x-secret'];
  if (!secret || secret !== process.env.LEADERBOARD_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { locations, updated } = req.body;

  if (!locations || !Array.isArray(locations) || locations.length === 0) {
    return res.status(400).json({ error: 'Invalid payload — locations array required' });
  }

  const store = getStore('leaderboard');
  await store.setJSON('current', {
    locations,
    updated: updated || new Date().toISOString(),
  });

  return res.status(200).json({ ok: true });
}
