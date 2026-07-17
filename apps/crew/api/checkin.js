// Proxy → Brain staff checkin. Forwards the EMPLOYEE's own bearer token (never a
// master key), plus the photo, GPS, and a structured note (job | type | tonnage).
const BRAIN_URL = process.env.BRAIN_API_URL || 'https://jworden-api.fly.dev';
export const config = { api: { bodyParser: { sizeLimit: '8mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'Not logged in.' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Bad JSON' }); } }
  const { note, gps_lat, gps_lng, dataB64, mime, filename } = body || {};

  try {
    const form = new FormData();
    if (note) form.append('note', note);
    if (gps_lat != null) form.append('gps_lat', String(gps_lat));
    if (gps_lng != null) form.append('gps_lng', String(gps_lng));
    if (dataB64) {
      const buf = Buffer.from(dataB64, 'base64');
      form.append('photo', new Blob([buf], { type: mime || 'image/jpeg' }), filename || 'shift.jpg');
    }
    const r = await fetch(`${BRAIN_URL}/api/v1/staff/checkin`, {
      method: 'POST', headers: { Authorization: auth }, body: form
    });
    const text = await r.text();
    if (!r.ok) return res.status(r.status).json({ error: `Check-in failed (${r.status})`, detail: text.slice(0, 200) });
    let json; try { json = JSON.parse(text); } catch { json = { raw: text }; }
    return res.status(200).json(json);
  } catch (e) {
    return res.status(502).json({ error: `Upload failed: ${e.message}` });
  }
}
