import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  TRADES,
  TRADES_BY_CATEGORY,
  calculateEstimate,
  formatDollars,
  pavingDecision,
  BINDER_INDEX,
  GROSS_MARGIN_FLOOR,
  BUSINESS_SHORT,
  STATE_LEGAL,
  AVAILABLE_STATES,
} from '@jworden/core';
import type { Job, CrewMember, Equipment, EstimateOutput, PavingDecision } from '@jworden/core';

// ── Storage helpers ──────────────────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : fallback; }
  catch { return fallback; }
}
function save<T>(key: string, val: T) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* noop */ }
}

// ── Types ────────────────────────────────────────────────────────────────────

type Station = 'home' | 'jarvis' | 'estimate' | 'jobs' | 'crew' | 'equipment' | 'weather' | 'banking' | 'legal' | 'crm' | 'lien';
type AutoMode = 'manual' | 'hybrid' | 'auto';

interface JarvisMsg { role: 'jarvis' | 'user'; text: string; }

interface WeatherDay {
  date: string; high: number; low: number;
  precip: number; wind: number; code: number;
  decision: PavingDecision;
}

// ── Nav definition ───────────────────────────────────────────────────────────

const NAV: { id: Station; icon: string; label: string }[] = [
  { id: 'home',      icon: '◉', label: 'Home'      },
  { id: 'jarvis',    icon: '⚡', label: 'Jarvis'    },
  { id: 'estimate',  icon: '◇', label: 'Estimate'  },
  { id: 'jobs',      icon: '☰', label: 'Jobs'      },
  { id: 'crew',      icon: '◎', label: 'Crew'      },
  { id: 'equipment', icon: '▣', label: 'Equipment' },
  { id: 'weather',   icon: '☁', label: 'Weather'   },
  { id: 'banking',   icon: '$', label: 'Banking'   },
  { id: 'legal',     icon: '§', label: 'Legal'     },
  { id: 'crm',       icon: '◈', label: 'CRM'       },
  { id: 'lien',      icon: '⚖', label: 'Lien Cal'  },
];

const JOB_STATUSES: Job['status'][] = [
  'Estimated','Proposed','Accepted','Scheduled','In Progress','Complete','Invoiced','Paid','Archived',
];

// ── Weather helpers ──────────────────────────────────────────────────────────

const WX_ICON: Record<number, string> = {};
function wxIcon(code?: number): string {
  if (code === undefined) return '—';
  if (code <= 1) return '☀';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫';
  if (code <= 67) return '🌧';
  if (code <= 77) return '❄';
  return '⛈';
}

function dayName(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' });
}

const DECISION_COLOR: Record<PavingDecision, string> = {
  'GO':     '#22c55e',
  'CAUTION':'#eab308',
  'NO-GO':  '#ef4444',
};

// ── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [station, setStation] = useState<Station>('home');
  const [autoMode, setAutoMode] = useState<AutoMode>('manual');
  const [now, setNow] = useState(new Date());
  const [cmd, setCmd] = useState(false);
  const cmdRef = useRef<HTMLInputElement>(null);

  // Persisted state
  const [jobs,  setJobs]  = useState<Job[]>(() => load('ws5-jobs', []));
  const [crew,  setCrew]  = useState<CrewMember[]>(() => load('ws5-crew', []));
  const [equip, setEquip] = useState<Equipment[]>(() => load('ws5-equip', []));

  // Estimate
  const [tradeKey, setTradeKey] = useState('asphalt_res');
  const [qty,   setQty]   = useState('');
  const [depth, setDepth] = useState('2');
  const [cost,  setCost]  = useState('');
  const [city,  setCity]  = useState('');
  const [result, setResult] = useState<EstimateOutput | null>(null);

  // Jarvis
  const [jInput, setJInput] = useState('');
  const [jLog,   setJLog]   = useState<JarvisMsg[]>([
    { role: 'jarvis', text: `Worden Standard v5 — ${Object.keys(TRADES).length} trades · 51 states · 9 stations online.\nAutonomy: MANUAL.\n\nReady.` },
  ]);
  const [jBusy, setJBusy] = useState(false);
  const jBottom = useRef<HTMLDivElement>(null);

  // Weather
  const [wxDays, setWxDays] = useState<WeatherDay[]>([]);
  const [wxCurrent, setWxCurrent] = useState<{ tempF: number; humidity: number; windMph: number; code: number } | null>(null);

  // Legal
  const [legalState, setLegalState] = useState('Virginia');
  const [cmdInput, setCmdInput] = useState('');

  // CRM
  const [crmLeads, setCrmLeads] = useState<Array<{
    id: string; name: string; phone: string | null; service_type: string | null;
    urgency: string | null; score_label: string | null; pipeline_stage: string;
    estimated_value: number | null; created_at: string;
  }>>([]);
  const [crmStage, setCrmStage] = useState('');
  const [crmLoading, setCrmLoading] = useState(false);

  // Lien Calendar
  const [lienEntries, setLienEntries] = useState<Array<{
    id: number; customer_name: string; project_address: string; state_code: string;
    lien_filing_deadline: string | null; preliminary_notice_deadline: string | null;
    foreclosure_deadline: string | null; days_until_lien: number | null; is_urgent?: boolean;
  }>>([]);
  const [lienCalcState, setLienCalcState] = useState('VA');
  const [lienStartDate, setLienStartDate] = useState('');
  const [lienLastDate, setLienLastDate] = useState('');
  const [lienCalcResult, setLienCalcResult] = useState<Record<string, unknown> | null>(null);
  const [lienLoading, setLienLoading] = useState(false);

  const API = import.meta.env.VITE_API_BASE_URL ?? '';
  const MK = import.meta.env.VITE_MASTER_KEY ?? '';

  // ── Side effects ──────────────────────────────────────────────────────────

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { save('ws5-jobs', jobs); }, [jobs]);
  useEffect(() => { save('ws5-crew', crew); }, [crew]);
  useEffect(() => { save('ws5-equip', equip); }, [equip]);
  useEffect(() => { jBottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [jLog, jBusy]);
  useEffect(() => { if (cmd) setTimeout(() => cmdRef.current?.focus(), 50); }, [cmd]);

  // Keyboard: Ctrl+K / Esc
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmd(p => !p); }
      if (e.key === 'Escape') setCmd(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Weather fetch
  useEffect(() => {
    const fetchWx = (lat: number, lon: number) => {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,weathercode&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=10`)
        .then(r => r.json())
        .then((d: {
          current?: { temperature_2m?: number; relative_humidity_2m?: number; wind_speed_10m?: number; weather_code?: number };
          daily?: { time?: string[]; temperature_2m_max?: number[]; temperature_2m_min?: number[]; precipitation_probability_max?: number[]; wind_speed_10m_max?: number[]; weathercode?: number[] };
        }) => {
          if (d.current) {
            setWxCurrent({
              tempF: d.current.temperature_2m ?? 0,
              humidity: d.current.relative_humidity_2m ?? 0,
              windMph: d.current.wind_speed_10m ?? 0,
              code: d.current.weather_code ?? 0,
            });
          }
          if (d.daily?.time) {
            setWxDays(d.daily.time.map((date, i) => ({
              date,
              high:   d.daily!.temperature_2m_max![i]!,
              low:    d.daily!.temperature_2m_min![i]!,
              precip: d.daily!.precipitation_probability_max![i]!,
              wind:   d.daily!.wind_speed_10m_max![i]!,
              code:   d.daily!.weathercode?.[i] ?? 0,
              decision: pavingDecision(d.daily!.temperature_2m_max![i]!, d.daily!.precipitation_probability_max![i]!, d.daily!.wind_speed_10m_max![i]!),
            })));
          }
        })
        .catch(() => undefined);
    };
    navigator.geolocation?.getCurrentPosition(
      p => fetchWx(p.coords.latitude, p.coords.longitude),
      () => fetchWx(37.38, -77.45), // Chester, VA default
    );
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────

  const activeJobs   = jobs.filter(j => !['Paid','Archived'].includes(j.status));
  const paidJobs     = jobs.filter(j => j.status === 'Paid');
  const invoicedJobs = jobs.filter(j => j.status === 'Invoiced');
  const revenue      = paidJobs.reduce((s, j) => s + j.bid, 0);
  const ar           = invoicedJobs.reduce((s, j) => s + j.bid, 0);
  const pipeline     = jobs.reduce((s, j) => s + j.bid, 0);
  const acColor      = autoMode === 'auto' ? '#22c55e' : autoMode === 'hybrid' ? '#eab308' : '#6b7280';

  // ── Estimate calc ─────────────────────────────────────────────────────────

  const calc = useCallback(() => {
    const q = parseFloat(qty), c = parseFloat(cost);
    if (!q || !c) return;
    const trade = TRADES[tradeKey]!;
    const out = calculateEstimate(
      { tradeKey, quantity: q, depthIn: trade.depthUnit ? parseFloat(depth) : undefined, costPerUnit: c, location: city },
      trade.defaultDensity,
    );
    out.tradeLabel = trade.label;
    setResult(out);
  }, [qty, cost, tradeKey, depth, city]);

  const saveJob = useCallback(() => {
    if (!result) return;
    const trade = TRADES[tradeKey]!;
    setJobs(p => [{
      id: result.id,
      trade: trade.label,
      city,
      quantity: result.quantity,
      bid: result.finalBid,
      status: 'Estimated',
      isLargeJob: result.isLargeJob,
      createdAt: result.generatedAt,
    }, ...p]);
    setStation('jobs');
  }, [result, tradeKey, city]);

  // ── Jarvis ────────────────────────────────────────────────────────────────

  const sendJarvis = useCallback(async (text?: string) => {
    const msg = (text ?? jInput).trim();
    if (!msg || jBusy) return;
    setJInput('');
    setJLog(p => [...p, { role: 'user', text: msg }]);
    setJBusy(true);
    try {
      const res = await fetch('/.netlify/functions/jarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...jLog.map(m => ({ role: m.role === 'jarvis' ? 'assistant' : 'user', content: m.text })), { role: 'user', content: msg }],
        }),
      });
      const d = await res.json() as { reply?: string };
      setJLog(p => [...p, { role: 'jarvis', text: d.reply ?? 'No response.' }]);
    } catch {
      setJLog(p => [...p, { role: 'jarvis', text: 'Network error — check connection.' }]);
    }
    setJBusy(false);
  }, [jInput, jBusy, jLog]);

  // ── Command palette ───────────────────────────────────────────────────────

  const execCmd = useCallback((q: string) => {
    setCmd(false);
    const c = q.replace('/', '').toLowerCase().trim();
    const stationMap: Record<string, Station> = { home:'home', jarvis:'jarvis', estimate:'estimate', jobs:'jobs', crew:'crew', equipment:'equipment', weather:'weather', banking:'banking', legal:'legal' };
    if (stationMap[c]) { setStation(stationMap[c]); return; }
    setJInput(q);
    setStation('jarvis');
    setTimeout(() => sendJarvis(q), 100);
  }, [sendJarvis]);

  // ── Shared styles ─────────────────────────────────────────────────────────

  const S = {
    inp: { width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:5, color:'#e0e2e8', fontFamily:'inherit', fontSize:14, padding:'7px 11px', outline:'none' } as React.CSSProperties,
    lbl: { fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' as const, color:'rgba(255,255,255,0.25)', display:'block', marginBottom:5 },
    row: { display:'flex', alignItems:'center', padding:'7px 10px', borderRadius:5, gap:10, borderBottom:'1px solid rgba(255,255,255,0.015)' } as React.CSSProperties,
    dot: (color: string): React.CSSProperties => ({ width:5, height:5, borderRadius:'50%', background:color, flexShrink:0 }),
    btn: (bg: string, color: string): React.CSSProperties => ({ background:bg, color, border:'none', borderRadius:5, cursor:'pointer', fontFamily:'inherit', fontWeight:600 }),
  };

  const todayDecision = wxDays[0]?.decision;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ display:'flex', height:'100vh', background:'#08090e', color:'#c9cdd8', fontFamily:'inherit', overflow:'hidden' }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width:188, minWidth:188, borderRight:'1px solid rgba(255,255,255,0.04)', display:'flex', flexDirection:'column', padding:'10px 6px' }}>
        {/* Brand */}
        <div style={{ padding:'8px 10px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)', marginBottom:6 }}>
          <div style={{ fontSize:12, fontWeight:700, letterSpacing:'0.16em', color:'#f5a623' }}>WORDEN</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.12)', letterSpacing:'0.08em' }}>STANDARD v5</div>
        </div>

        {/* Search */}
        <button
          onClick={() => setCmd(true)}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 10px', borderRadius:5, border:'1px solid rgba(255,255,255,0.04)', background:'transparent', color:'rgba(255,255,255,0.15)', fontFamily:'inherit', fontSize:13, cursor:'pointer', marginBottom:8, textAlign:'left', width:'100%' }}
        >
          <span style={{ flex:1 }}>Search…</span>
          <span style={{ fontSize:10, background:'rgba(255,255,255,0.04)', padding:'1px 4px', borderRadius:2 }}>⌘K</span>
        </button>

        {/* Nav */}
        {NAV.map(n => {
          const badge = n.id === 'jobs' ? activeJobs.length : n.id === 'crew' ? crew.length : n.id === 'equipment' ? equip.length : 0;
          return (
            <button
              key={n.id}
              onClick={() => setStation(n.id)}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'5px 10px', borderRadius:4, border:'none', background: station === n.id ? 'rgba(255,255,255,0.04)' : 'transparent', color: station === n.id ? '#e0e2e8' : 'rgba(255,255,255,0.28)', fontFamily:'inherit', fontSize:14, cursor:'pointer', textAlign:'left', width:'100%', marginBottom:1 }}
            >
              <span style={{ fontSize:13, width:14, textAlign:'center', color: station === n.id ? '#f5a623' : 'rgba(255,255,255,0.12)' }}>{n.icon}</span>
              <span style={{ flex:1 }}>{n.label}</span>
              {!!badge && <span style={{ fontSize:11, color:'rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', padding:'0 5px', borderRadius:8 }}>{badge}</span>}
            </button>
          );
        })}

        {/* Autonomy toggle */}
        <div style={{ marginTop:'auto', padding:'10px 8px', borderTop:'1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ display:'flex', background:'rgba(255,255,255,0.02)', borderRadius:4, padding:2 }}>
            {(['manual','hybrid','auto'] as AutoMode[]).map(m => (
              <button key={m} onClick={() => setAutoMode(m)} style={{ flex:1, fontFamily:'inherit', fontSize:10, fontWeight:600, padding:'4px 0', borderRadius:3, border:'none', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.06em', background: autoMode === m ? 'rgba(255,255,255,0.05)' : 'transparent', color: autoMode === m ? acColor : 'rgba(255,255,255,0.1)' }}>{m}</button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:3, marginTop:5, justifyContent:'center' }}>
            <span style={{ width:4, height:4, borderRadius:'50%', background:acColor, boxShadow:`0 0 5px ${acColor}`, animation:'pulse-dot 2.5s infinite' }} />
            <span style={{ fontSize:10, color:acColor, fontWeight:600 }}>{autoMode.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column' }}>
        {/* Header bar */}
        <div style={{ padding:'6px 18px', borderBottom:'1px solid rgba(255,255,255,0.03)', display:'flex', alignItems:'center', justifyContent:'space-between', minHeight:34, flexShrink:0 }}>
          <div style={{ fontSize:15, fontWeight:600, color:'#e0e2e8' }}>{{ home:'Home', jarvis:'Jarvis', estimate:'New Estimate', jobs:'Jobs', crew:'Crew', equipment:'Equipment', weather:'Weather', banking:'Banking', legal:'Legal / Compliance', crm:'CRM', lien:'Lien Calendar' }[station]}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.1)', display:'flex', gap:12, alignItems:'center' }}>
            {todayDecision && <span style={{ color: DECISION_COLOR[todayDecision], fontWeight:700, fontSize:11 }}>PAVING: {todayDecision}</span>}
            {now.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit' })}
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'14px 18px' }}>

          {/* ── HOME ── */}
          {station === 'home' && (
            <div style={{ maxWidth:720 }}>
              <div style={{ marginBottom:22 }}>
                <div style={{ fontSize:22, color:'#e0e2e8', fontWeight:400, marginBottom:3 }}>
                  Good {now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening'}
                </div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.18)' }}>{activeJobs.length} active · {crew.length} crew · {equip.length} equipment · Pipeline {formatDollars(pipeline)}</div>
              </div>

              {/* Telemetry */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:1, background:'rgba(255,255,255,0.02)', borderRadius:7, overflow:'hidden', marginBottom:18 }}>
                {[
                  { v: String(activeJobs.length), l:'Active', c: activeJobs.length ? '#22c55e' : '#333' },
                  { v: formatDollars(revenue),    l:'Revenue', c:'#f5a623' },
                  { v: formatDollars(ar),          l:'Receivable', c: ar ? '#eab308' : '#333' },
                  { v: formatDollars(pipeline),    l:'Pipeline', c:'#c9cdd8' },
                  { v: '35%',                      l:'Margin', c:'#22c55e' },
                  { v: autoMode.toUpperCase(),     l:'Autonomy', c: acColor },
                ].map((m, i) => (
                  <div key={i} style={{ padding:'10px 8px', background:'#08090e', textAlign:'center' }}>
                    <div style={{ fontSize:14, fontWeight:700, color:m.c, fontVariantNumeric:'tabular-nums' }}>{m.v}</div>
                    <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.1)', marginTop:2 }}>{m.l}</div>
                  </div>
                ))}
              </div>

              {/* Quick Jarvis */}
              <div style={{ display:'flex', gap:6, marginBottom:18 }}>
                <input value={jInput} onChange={e => setJInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { setStation('jarvis'); sendJarvis(); } }} placeholder="Ask Jarvis anything…" style={{ ...S.inp, flex:1, fontSize:14 }} />
                <button onClick={() => { setStation('jarvis'); sendJarvis(); }} style={{ fontFamily:'inherit', fontSize:12, fontWeight:700, padding:'0 14px', background:'#f5a623', color:'#08090e', border:'none', borderRadius:5, cursor:'pointer' }}>Go</button>
              </div>

              {/* Recent jobs */}
              {jobs.length > 0 && (
                <div>
                  <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.1)', marginBottom:6 }}>Recent Jobs</div>
                  {jobs.slice(0, 8).map(j => (
                    <div key={j.id} onClick={() => setStation('jobs')} style={{ ...S.row, cursor:'pointer' }}>
                      <span style={S.dot(j.status === 'Paid' ? '#22c55e' : j.status === 'In Progress' ? '#f5a623' : 'rgba(255,255,255,0.06)')} />
                      <span style={{ flex:1, fontSize:14, color:'#c9cdd8', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{j.trade}{j.city ? ` · ${j.city}` : ''}</span>
                      <span style={{ fontSize:13, color:'rgba(255,255,255,0.22)', fontVariantNumeric:'tabular-nums' }}>{formatDollars(j.bid)}</span>
                      <span style={{ fontSize:11, color:'rgba(255,255,255,0.1)', minWidth:70, textAlign:'right' }}>{j.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── JARVIS ── */}
          {station === 'jarvis' && (
            <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 80px)', maxWidth:680 }}>
              <div style={{ flex:1, overflowY:'auto', paddingBottom:8 }}>
                {jLog.map((m, i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom:10, justifyContent: m.role === 'jarvis' ? 'flex-start' : 'flex-end' }}>
                    {m.role === 'jarvis' && <div style={{ width:18, height:18, borderRadius:3, background:'rgba(245,166,35,0.06)', border:'1px solid rgba(245,166,35,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, flexShrink:0, marginTop:2 }}>⚡</div>}
                    <div style={{ maxWidth:'86%', background: m.role === 'jarvis' ? 'rgba(255,255,255,0.02)' : 'rgba(245,166,35,0.03)', border:`1px solid ${m.role === 'jarvis' ? 'rgba(255,255,255,0.03)' : 'rgba(245,166,35,0.06)'}`, borderRadius:6, padding:'7px 11px', fontSize:13, lineHeight:1.8, whiteSpace:'pre-wrap' }}>{m.text}</div>
                  </div>
                ))}
                {jBusy && <div style={{ fontSize:12, color:'rgba(255,255,255,0.1)', paddingLeft:26, animation:'pulse-dot 1s infinite' }}>Processing…</div>}
                <div ref={jBottom} />
              </div>
              <div style={{ display:'flex', gap:6, borderTop:'1px solid rgba(255,255,255,0.03)', paddingTop:8 }}>
                <input value={jInput} onChange={e => setJInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendJarvis(); }} placeholder="Command Jarvis…" style={{ ...S.inp, flex:1 }} />
                <button onClick={() => sendJarvis()} disabled={jBusy} style={{ fontFamily:'inherit', fontSize:13, fontWeight:600, padding:'0 16px', background: jBusy ? 'rgba(255,255,255,0.02)' : '#f5a623', color: jBusy ? 'rgba(255,255,255,0.1)' : '#08090e', border:'none', borderRadius:5, cursor: jBusy ? 'wait' : 'pointer' }}>{jBusy ? '…' : 'Send'}</button>
              </div>
            </div>
          )}

          {/* ── ESTIMATE ── */}
          {station === 'estimate' && (
            <div style={{ maxWidth:520 }}>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <div>
                  <label style={S.lbl}>Trade / Service</label>
                  <select value={tradeKey} onChange={e => { setTradeKey(e.target.value); setResult(null); }} style={{ ...S.inp, cursor:'pointer' }}>
                    {Object.entries(TRADES_BY_CATEGORY).map(([cat, trades]) => (
                      <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
                        {Object.entries(trades).map(([k, spec]) => <option key={k} value={k}>{spec.label}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div style={{ display:'grid', gridTemplateColumns: TRADES[tradeKey]?.depthUnit ? '1fr 1fr' : '1fr', gap:10 }}>
                  <div>
                    <label style={S.lbl}>{TRADES[tradeKey]?.unit === 'sqft' ? 'Square Feet' : TRADES[tradeKey]?.unit === 'lnft' ? 'Linear Feet' : 'Quantity'}</label>
                    <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="0" style={S.inp} />
                  </div>
                  {TRADES[tradeKey]?.depthUnit && (
                    <div>
                      <label style={S.lbl}>Depth (in)</label>
                      <input type="number" value={depth} onChange={e => setDepth(e.target.value)} step="0.25" style={S.inp} />
                    </div>
                  )}
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <div>
                    <label style={S.lbl}>Cost ({TRADES[tradeKey]?.costLabel})</label>
                    <input type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="0" style={S.inp} />
                  </div>
                  <div>
                    <label style={S.lbl}>Location</label>
                    <input value={city} onChange={e => setCity(e.target.value)} placeholder="City, VA" style={S.inp} />
                  </div>
                </div>

                <button onClick={calc} style={{ width:'100%', padding:'9px', background:'#f5a623', color:'#08090e', fontFamily:'inherit', fontSize:14, fontWeight:700, border:'none', borderRadius:5, cursor:'pointer' }}>Calculate</button>
              </div>

              {result && (
                <div style={{ marginTop:18, paddingTop:18, borderTop:'1px solid rgba(255,255,255,0.04)' }}>
                  {result.isLargeJob && <div style={{ padding:'6px 10px', borderRadius:4, background:'rgba(239,68,68,0.05)', border:'1px solid rgba(239,68,68,0.08)', fontSize:12, color:'#ef4444', marginBottom:10 }}>⚠ {result.quantity.toLocaleString()} {TRADES[tradeKey]?.unit} — exceeds 20K threshold. Owner review required.</div>}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:'rgba(255,255,255,0.02)', borderRadius:6, overflow:'hidden', marginBottom:12 }}>
                    {[
                      result.tonnage !== null && { l:'Tonnage', v: result.tonnage.toFixed(2) + ' tons' },
                      { l:'Material', v: formatDollars(result.materialCost) },
                      { l:'Binder', v: formatDollars(BINDER_INDEX) },
                      { l:`Final Bid · ${(GROSS_MARGIN_FLOOR * 100).toFixed(0)}%`, v: formatDollars(result.finalBid), big: true },
                    ].filter(Boolean).map((row, i) => {
                      const r = row as { l: string; v: string; big?: boolean };
                      return (
                        <div key={i} style={{ padding:12, background:'#08090e', gridColumn: r.big ? 'span 2' : undefined }}>
                          <div style={{ fontSize:10, color:'rgba(255,255,255,0.15)', marginBottom:3 }}>{r.l}</div>
                          <div style={{ fontSize: r.big ? 20 : 15, fontWeight:700, color: r.big ? '#f5a623' : '#c9cdd8', fontVariantNumeric:'tabular-nums' }}>{r.v}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={saveJob} style={{ flex:1, padding:'7px', borderRadius:4, border:'1px solid rgba(34,197,94,0.1)', background:'rgba(34,197,94,0.03)', color:'#22c55e', fontFamily:'inherit', fontSize:13, fontWeight:600, cursor:'pointer' }}>Save as Job</button>
                    <button onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))} style={{ flex:1, padding:'7px', borderRadius:4, border:'1px solid rgba(255,255,255,0.04)', background:'rgba(255,255,255,0.01)', color:'rgba(255,255,255,0.25)', fontFamily:'inherit', fontSize:13, cursor:'pointer' }}>Copy JSON</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── JOBS ── */}
          {station === 'jobs' && (
            <div style={{ maxWidth:780 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.18)' }}>{activeJobs.length} active · Pipeline {formatDollars(pipeline)}</span>
                <button onClick={() => setStation('estimate')} style={{ fontFamily:'inherit', fontSize:13, padding:'4px 11px', borderRadius:4, border:'1px solid rgba(255,255,255,0.05)', background:'transparent', color:'rgba(255,255,255,0.3)', cursor:'pointer' }}>+ Estimate</button>
              </div>
              {jobs.length === 0
                ? <div style={{ textAlign:'center', padding:50, color:'rgba(255,255,255,0.08)', fontSize:14 }}>No jobs yet — create an estimate first</div>
                : jobs.map((j, i) => (
                    <div key={j.id} style={S.row}>
                      <span style={S.dot(j.status === 'Paid' ? '#22c55e' : j.status === 'In Progress' ? '#f5a623' : j.status === 'Complete' ? '#3b82f6' : 'rgba(255,255,255,0.06)')} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14 }}>{j.trade}{j.city ? ` · ${j.city}` : ''}</div>
                        <div style={{ fontSize:10, color:'rgba(255,255,255,0.08)', marginTop:1 }}>{j.id}</div>
                      </div>
                      <span style={{ fontSize:13, color:'rgba(255,255,255,0.25)', fontVariantNumeric:'tabular-nums', minWidth:80, textAlign:'right' }}>{formatDollars(j.bid)}</span>
                      <select
                        value={j.status}
                        onChange={e => setJobs(p => { const s = [...p]; s[i] = { ...s[i]!, status: e.target.value as Job['status'] }; return s; })}
                        style={{ fontFamily:'inherit', fontSize:12, background:'transparent', color: j.status === 'Paid' ? '#22c55e' : j.status === 'In Progress' ? '#f5a623' : 'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.04)', borderRadius:3, padding:'2px 4px', cursor:'pointer', minWidth:80 }}
                      >
                        {JOB_STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  ))}
            </div>
          )}

          {/* ── CREW ── */}
          {station === 'crew' && (
            <div style={{ maxWidth:520 }}>
              <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:10 }}>
                <button onClick={() => {
                  const name = prompt('Name:'); if (!name) return;
                  const role = prompt('Role:') ?? 'Laborer';
                  setCrew(p => [...p, { id: String(Date.now()), name, role, status:'Available' }]);
                }} style={{ fontFamily:'inherit', fontSize:13, padding:'4px 11px', borderRadius:4, border:'1px solid rgba(255,255,255,0.05)', background:'transparent', color:'rgba(255,255,255,0.3)', cursor:'pointer' }}>+ Add</button>
              </div>
              {crew.length === 0
                ? <div style={{ textAlign:'center', padding:50, color:'rgba(255,255,255,0.08)' }}>No crew</div>
                : crew.map((c, i) => (
                    <div key={c.id} style={S.row}>
                      <span style={S.dot(c.status === 'Available' ? '#22c55e' : c.status === 'On Job' ? '#f5a623' : 'rgba(255,255,255,0.08)')} />
                      <div style={{ flex:1 }}><div style={{ fontSize:14 }}>{c.name}</div><div style={{ fontSize:11, color:'rgba(255,255,255,0.1)' }}>{c.role}</div></div>
                      <select value={c.status} onChange={e => setCrew(p => { const s = [...p]; s[i] = { ...s[i]!, status: e.target.value as CrewMember['status'] }; return s; })} style={{ fontFamily:'inherit', fontSize:12, background:'transparent', color: c.status === 'Available' ? '#22c55e' : c.status === 'On Job' ? '#f5a623' : 'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.04)', borderRadius:3, padding:'2px 4px', cursor:'pointer' }}>
                        {['Available','On Job','Off','Vacation','Terminated'].map(s => <option key={s}>{s}</option>)}
                      </select>
                      <button onClick={() => setCrew(p => p.filter((_, x) => x !== i))} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.08)', cursor:'pointer', fontSize:16 }}>×</button>
                    </div>
                  ))}
            </div>
          )}

          {/* ── EQUIPMENT ── */}
          {station === 'equipment' && (
            <div style={{ maxWidth:520 }}>
              <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:10 }}>
                <button onClick={() => {
                  const name = prompt('Equipment:'); if (!name) return;
                  const type = prompt('Type:') ?? 'Other';
                  setEquip(p => [...p, { id: String(Date.now()), name, type, status:'Available' }]);
                }} style={{ fontFamily:'inherit', fontSize:13, padding:'4px 11px', borderRadius:4, border:'1px solid rgba(255,255,255,0.05)', background:'transparent', color:'rgba(255,255,255,0.3)', cursor:'pointer' }}>+ Add</button>
              </div>
              {equip.length === 0
                ? <div style={{ textAlign:'center', padding:50, color:'rgba(255,255,255,0.08)' }}>No equipment</div>
                : equip.map((e, i) => (
                    <div key={e.id} style={S.row}>
                      <span style={S.dot(e.status === 'Available' ? '#22c55e' : e.status === 'On Job' ? '#f5a623' : e.status === 'Down' ? '#ef4444' : 'rgba(255,255,255,0.08)')} />
                      <div style={{ flex:1 }}><div style={{ fontSize:14 }}>{e.name}</div><div style={{ fontSize:11, color:'rgba(255,255,255,0.1)' }}>{e.type}</div></div>
                      <select value={e.status} onChange={ev => setEquip(p => { const s = [...p]; s[i] = { ...s[i]!, status: ev.target.value as Equipment['status'] }; return s; })} style={{ fontFamily:'inherit', fontSize:12, background:'transparent', color: e.status === 'Available' ? '#22c55e' : e.status === 'On Job' ? '#f5a623' : e.status === 'Down' ? '#ef4444' : 'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.04)', borderRadius:3, padding:'2px 4px', cursor:'pointer' }}>
                        {['Available','On Job','Maintenance','Down','Retired'].map(s => <option key={s}>{s}</option>)}
                      </select>
                      <button onClick={() => setEquip(p => p.filter((_, x) => x !== i))} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.08)', cursor:'pointer', fontSize:16 }}>×</button>
                    </div>
                  ))}
            </div>
          )}

          {/* ── WEATHER ── */}
          {station === 'weather' && (
            <div style={{ maxWidth:680 }}>
              {wxCurrent && (
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
                  <span style={{ fontSize:32 }}>{wxIcon(wxCurrent.code)}</span>
                  <div>
                    <div style={{ fontSize:28, fontWeight:700, color:'#e0e2e8', fontVariantNumeric:'tabular-nums' }}>{Math.round(wxCurrent.tempF)}°F</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.18)' }}>Wind {Math.round(wxCurrent.windMph)} mph · Humidity {Math.round(wxCurrent.humidity)}%</div>
                  </div>
                  {wxDays[0] && (
                    <div style={{ marginLeft:'auto', padding:'8px 16px', borderRadius:6, border:`1px solid ${DECISION_COLOR[wxDays[0].decision]}20`, background:`${DECISION_COLOR[wxDays[0].decision]}08`, textAlign:'center' }}>
                      <div style={{ fontSize:13, fontWeight:700, color: DECISION_COLOR[wxDays[0].decision] }}>{wxDays[0].decision}</div>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,0.12)', marginTop:2 }}>PAVING TODAY</div>
                    </div>
                  )}
                </div>
              )}
              {!wxCurrent && <div style={{ color:'rgba(255,255,255,0.12)', fontSize:13, animation:'pulse-dot 1.5s infinite' }}>Loading weather…</div>}

              <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.1)', marginBottom:8 }}>10-Day Paving Forecast</div>
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                {wxDays.map((d, i) => (
                  <div key={i} style={{ ...S.row }}>
                    <span style={{ fontSize:12, color:'rgba(255,255,255,0.18)', minWidth:30 }}>{dayName(d.date)}</span>
                    <span style={{ fontSize:13 }}>{wxIcon(d.code)}</span>
                    <span style={{ fontSize:13, fontVariantNumeric:'tabular-nums', minWidth:70 }}>{Math.round(d.low)}°/{Math.round(d.high)}°</span>
                    <span style={{ fontSize:12, color:'rgba(255,255,255,0.14)', minWidth:50 }}>💧 {d.precip}%</span>
                    <span style={{ fontSize:12, color:'rgba(255,255,255,0.14)', minWidth:55 }}>💨 {Math.round(d.wind)} mph</span>
                    <span style={{ marginLeft:'auto', fontSize:12, fontWeight:700, color: DECISION_COLOR[d.decision], background:`${DECISION_COLOR[d.decision]}08`, border:`1px solid ${DECISION_COLOR[d.decision]}15`, padding:'2px 8px', borderRadius:3 }}>{d.decision}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BANKING ── */}
          {station === 'banking' && (
            <div style={{ maxWidth:680 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:1, background:'rgba(255,255,255,0.02)', borderRadius:7, overflow:'hidden', marginBottom:22 }}>
                {[
                  { l:'Revenue (Paid)', v: formatDollars(revenue), c:'#22c55e', sub:`${paidJobs.length} jobs` },
                  { l:'Receivable', v: formatDollars(ar), c: ar ? '#eab308' : 'rgba(255,255,255,0.1)', sub:`${invoicedJobs.length} invoices` },
                  { l:'Total Pipeline', v: formatDollars(pipeline), c:'#c9cdd8', sub:`${jobs.length} jobs` },
                ].map((m, i) => (
                  <div key={i} style={{ padding:18, background:'#08090e' }}>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.1)', marginBottom:4 }}>{m.l}</div>
                    <div style={{ fontSize:20, fontWeight:700, color:m.c, fontVariantNumeric:'tabular-nums' }}>{m.v}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.08)', marginTop:2 }}>{m.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.1)', marginBottom:8 }}>Margin Protection</div>
              <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:5, padding:12, marginBottom:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.25)' }}>Target margin floor</span>
                  <span style={{ fontSize:14, fontWeight:700, color:'#22c55e' }}>35%</span>
                </div>
                <div style={{ height:2, background:'rgba(255,255,255,0.03)', borderRadius:1, marginTop:8, overflow:'hidden' }}>
                  <div style={{ width:'35%', height:'100%', background:'#22c55e', borderRadius:1 }} />
                </div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.08)', marginTop:5 }}>Every estimate enforces 35% net margin. Binder index ${BINDER_INDEX} + machine health $0.08/ton applied automatically.</div>
              </div>

              <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.1)', marginBottom:8 }}>Pipeline by Status</div>
              {JOB_STATUSES.map(status => {
                const sj = jobs.filter(j => j.status === status);
                if (!sj.length) return null;
                const tot = sj.reduce((a, j) => a + j.bid, 0);
                return (
                  <div key={status} style={{ display:'flex', alignItems:'center', padding:'5px 10px', gap:8 }}>
                    <span style={S.dot(status === 'Paid' ? '#22c55e' : status === 'In Progress' ? '#f5a623' : 'rgba(255,255,255,0.08)')} />
                    <span style={{ flex:1, fontSize:13, color:'rgba(255,255,255,0.25)' }}>{status}</span>
                    <span style={{ fontSize:12, color:'rgba(255,255,255,0.1)', fontVariantNumeric:'tabular-nums' }}>{sj.length} jobs</span>
                    <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.35)', fontVariantNumeric:'tabular-nums', minWidth:90, textAlign:'right' }}>{formatDollars(tot)}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── CRM ── */}
          {station === 'crm' && (
            <div style={{ maxWidth: 720 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
                <select
                  value={crmStage}
                  onChange={e => setCrmStage(e.target.value)}
                  style={{ ...S.inp, width: 180, cursor: 'pointer' }}
                >
                  <option value="">All Stages</option>
                  {['new', 'contacted', 'proposal_sent', 'negotiating', 'won', 'lost'].map(s => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setCrmLoading(true);
                    const qs = crmStage ? `?pipeline_stage=${crmStage}` : '';
                    fetch(`${API}/api/v1/crm/leads${qs}`, {
                      headers: { 'X-Master-Key': MK },
                    })
                      .then(r => r.json())
                      .then((d: { leads: typeof crmLeads }) => setCrmLeads(d.leads || []))
                      .catch(() => {/* noop */})
                      .finally(() => setCrmLoading(false));
                  }}
                  style={{ ...S.btn('#f5a623', '#000'), fontSize: 11, padding: '6px 14px' }}
                >
                  {crmLoading ? 'Loading…' : 'Load'}
                </button>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>
                  {crmLeads.length} leads
                </span>
              </div>
              {crmLeads.length === 0 && !crmLoading && (
                <div style={{ color: 'rgba(255,255,255,0.1)', fontSize: 12, padding: '20px 0' }}>
                  Press Load to fetch leads from the API.
                </div>
              )}
              {crmLeads.map(lead => {
                const tierColor: Record<string, string> = { WHALE: '#3b82f6', SHARK: '#8b5cf6', FISH: '#22c55e' };
                const color = tierColor[lead.score_label ?? ''] ?? 'rgba(255,255,255,0.08)';
                return (
                  <div key={lead.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 5, background: 'rgba(255,255,255,0.015)', marginBottom: 2 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.5)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lead.name}
                    </span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                      {lead.service_type ?? lead.pipeline_stage}
                    </span>
                    {lead.estimated_value && (
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
                        ${lead.estimated_value.toLocaleString()}
                      </span>
                    )}
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.12)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      {lead.pipeline_stage.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── LIEN CALENDAR ── */}
          {station === 'lien' && (
            <div style={{ maxWidth: 680 }}>
              {/* Calculator */}
              <div style={{ background: 'rgba(255,255,255,0.015)', borderRadius: 6, padding: '12px 14px', marginBottom: 14, border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f5a623', marginBottom: 10 }}>
                  Calculate Deadlines
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div>
                    <label style={S.lbl}>State</label>
                    <input value={lienCalcState} onChange={e => setLienCalcState(e.target.value.toUpperCase())} maxLength={2} style={S.inp} placeholder="VA" />
                  </div>
                  <div>
                    <label style={S.lbl}>Project Start</label>
                    <input type="date" value={lienStartDate} onChange={e => setLienStartDate(e.target.value)} style={S.inp} />
                  </div>
                  <div>
                    <label style={S.lbl}>Last Furnishing</label>
                    <input type="date" value={lienLastDate} onChange={e => setLienLastDate(e.target.value)} style={S.inp} />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!lienStartDate || !lienLastDate) return;
                    setLienLoading(true);
                    fetch(`${API}/api/v1/lien/calculate`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'X-Master-Key': MK },
                      body: JSON.stringify({
                        state_code: lienCalcState,
                        project_start_date: lienStartDate,
                        last_furnishing_date: lienLastDate,
                      }),
                    })
                      .then(r => r.json())
                      .then((d: Record<string, unknown>) => setLienCalcResult(d))
                      .catch(() => {/* noop */})
                      .finally(() => setLienLoading(false));
                  }}
                  style={{ ...S.btn('#f5a623', '#000'), fontSize: 11, padding: '6px 14px' }}
                >
                  {lienLoading ? 'Calculating…' : 'Calculate'}
                </button>
                {lienCalcResult && (
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {([
                      ['State', String(lienCalcResult.state_code)],
                      ['Preliminary Notice', lienCalcResult.preliminary_notice_deadline ? new Date(String(lienCalcResult.preliminary_notice_deadline)).toLocaleDateString() : 'Not required'],
                      ['Lien Filing Deadline', lienCalcResult.lien_filing_deadline ? new Date(String(lienCalcResult.lien_filing_deadline)).toLocaleDateString() : '—'],
                      ['Days Until Lien', String(lienCalcResult.days_until_lien_deadline ?? '—')],
                      ['Foreclosure Deadline', lienCalcResult.foreclosure_deadline ? new Date(String(lienCalcResult.foreclosure_deadline)).toLocaleDateString() : '—'],
                      ['Notes', String(lienCalcResult.state_notes ?? '')],
                    ] as [string, string][]).map(([label, value]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 12, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>{label}</span>
                        <span style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'right' }}>{value}</span>
                      </div>
                    ))}
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.1)', marginTop: 4 }}>
                      ⚖ Verify all deadlines with a licensed attorney.
                    </div>
                  </div>
                )}
              </div>

              {/* Tracked entries */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                <button
                  onClick={() => {
                    setLienLoading(true);
                    fetch(`${API}/api/v1/lien/upcoming?days_ahead=60`, {
                      headers: { 'X-Master-Key': MK },
                    })
                      .then(r => r.json())
                      .then((d: { entries: typeof lienEntries }) => setLienEntries(d.entries || []))
                      .catch(() => {/* noop */})
                      .finally(() => setLienLoading(false));
                  }}
                  style={{ ...S.btn('rgba(255,255,255,0.06)', 'rgba(255,255,255,0.4)'), fontSize: 11, padding: '5px 12px' }}
                >
                  Load Upcoming (60 days)
                </button>
                {lienEntries.length > 0 && (
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>{lienEntries.length} entries</span>
                )}
              </div>
              {lienEntries.map(entry => {
                const urgent = entry.is_urgent || (entry.days_until_lien !== null && entry.days_until_lien <= 7);
                return (
                  <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 5, background: urgent ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.015)', marginBottom: 2, border: urgent ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(255,255,255,0.03)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: urgent ? '#ef4444' : 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.5)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.customer_name} — {entry.project_address}
                    </span>
                    <span style={{ fontSize: 11, color: urgent ? '#ef4444' : 'rgba(255,255,255,0.15)', whiteSpace: 'nowrap', fontWeight: urgent ? 700 : 400 }}>
                      {entry.days_until_lien !== null ? `${entry.days_until_lien}d` : '—'} · {entry.state_code}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── LEGAL ── */}
          {station === 'legal' && (
            <div style={{ maxWidth:620 }}>
              <div style={{ marginBottom:14 }}>
                <label style={S.lbl}>Select State</label>
                <select value={legalState} onChange={e => setLegalState(e.target.value)} style={{ ...S.inp, cursor:'pointer' }}>
                  {AVAILABLE_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.08)', marginTop:4 }}>{AVAILABLE_STATES.length} states · Ask Jarvis for any state not listed</div>
              </div>
              {STATE_LEGAL[legalState] && (
                <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  {(Object.entries({
                    'Contractor Licensing': STATE_LEGAL[legalState]!.licensing,
                    'Bond Requirements': STATE_LEGAL[legalState]!.bond,
                    'Mechanics Lien Law': STATE_LEGAL[legalState]!.lienLaw,
                    'Worker Classification': STATE_LEGAL[legalState]!.workerClassification,
                    'Prevailing Wage': STATE_LEGAL[legalState]!.prevailingWage,
                    'OSHA': STATE_LEGAL[legalState]!.osha,
                    'Continuing Education': STATE_LEGAL[legalState]!.continuingEducation,
                  })).map(([label, value]) => (
                    <div key={label} style={{ background:'rgba(255,255,255,0.015)', borderRadius:5, padding:'10px 12px', borderLeft:'2px solid rgba(245,166,35,0.15)', marginBottom:2 }}>
                      <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'#f5a623', marginBottom:3 }}>{label}</div>
                      <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.7 }}>{value}</div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop:14, padding:'9px 11px', borderRadius:5, border:'1px solid rgba(255,255,255,0.03)', fontSize:11, color:'rgba(255,255,255,0.1)', lineHeight:1.7 }}>
                ⚖ Educational information based on public law. Consult a licensed attorney for legal advice specific to your situation.
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── CMD PALETTE ── */}
      {cmd && (
        <div onClick={() => setCmd(false)} style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:'18vh' }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)' }} />
          <div onClick={e => e.stopPropagation()} style={{ position:'relative', width:'100%', maxWidth:440, background:'#0e1018', border:'1px solid rgba(255,255,255,0.06)', borderRadius:8, overflow:'hidden', boxShadow:'0 16px 50px rgba(0,0,0,0.5)' }}>
            <input
              ref={cmdRef}
              value={cmdInput}
              onChange={e => setCmdInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && cmdInput.trim()) execCmd(cmdInput.trim()); if (e.key === 'Escape') setCmd(false); }}
              placeholder="Search or ask Jarvis…"
              style={{ width:'100%', background:'transparent', border:'none', borderBottom:'1px solid rgba(255,255,255,0.04)', color:'#e0e2e8', fontFamily:'inherit', fontSize:13, padding:'12px 16px', outline:'none' }}
            />
            <div style={{ padding:6 }}>
              {NAV.map(n => (
                <button key={n.id} onClick={() => { execCmd('/' + n.id); setCmdInput(''); }} style={{ display:'block', width:'100%', textAlign:'left', padding:'5px 11px', borderRadius:4, border:'none', background:'transparent', color:'rgba(255,255,255,0.3)', fontFamily:'inherit', fontSize:13, cursor:'pointer' }}>
                  {n.label}<span style={{ float:'right', fontSize:11, color:'rgba(255,255,255,0.08)' }}>/{n.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
