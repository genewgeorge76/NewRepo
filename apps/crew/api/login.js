// Proxy → Brain staff login. Employee's own username/password; returns their token.
const BRAIN_URL = process.env.BRAIN_API_URL || 'https://jworden-api.fly.dev';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Bad JSON' }); } }
  const { username, password } = body || {};
  if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });
  try {
    const r = await fetch(`${BRAIN_URL}/api/v1/staff/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(r.status).json({ error: data.detail || 'Login failed' });
    return res.status(200).json(data); // { token, username, role }
  } catch (e) {
    return res.status(502).json({ error: `Brain unreachable: ${e.message}` });
  }
}
