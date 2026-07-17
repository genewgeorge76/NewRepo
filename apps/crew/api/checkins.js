// Proxy → Brain: this employee's own recent check-ins (their shift log).
const BRAIN_URL = process.env.BRAIN_API_URL || 'https://jworden-api.fly.dev';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'Not logged in.' });
  try {
    const r = await fetch(`${BRAIN_URL}/api/v1/staff/checkins`, { headers: { Authorization: auth } });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(r.status).json({ error: data.detail || 'Could not load shift log' });
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({ error: `Brain unreachable: ${e.message}` });
  }
}
