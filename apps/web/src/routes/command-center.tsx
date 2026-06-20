import React, { useEffect, useState } from 'react';
import { BarChart3, Users, FileText, AlertTriangle, TrendingUp, Camera, Target } from 'lucide-react';

interface KpiData {
  generated_at: string;
  pipeline: { total_leads: number; new_leads_mtd: number; open_leads: number; won_ytd: number };
  jobs: { total: number; active: number };
  work_orders: { pending: number; in_progress: number; completed_mtd: number };
  workforce: { active_crew: number; active_subs: number; total_headcount: number };
  safety: { incidents_ytd: number; recordables_ytd: number; trir: number };
  cashflow: { inflow_30d: number; outflow_30d: number; net_30d: number };
  proposals: { total: number; won: number; win_rate_pct: number };
  market: { vdot_open_bids: number; vdot_total_tracked: number };
  gallery: { photos_total: number };
}

function StatCard({ label, value, sub, accent = false }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div className={`bg-zinc-900 border rounded-xl p-5 ${accent ? 'border-yellow-500/40' : 'border-zinc-800'}`}>
      <p className="text-zinc-500 text-xs font-medium mb-1">{label}</p>
      <p className={`text-2xl font-black ${accent ? 'text-yellow-400' : 'text-white'}`}>{value}</p>
      {sub && <p className="text-zinc-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-yellow-400" />
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {children}
      </div>
    </div>
  );
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

export function CommandCenterPage() {
  const [kpi, setKpi] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authKey, setAuthKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authErr, setAuthErr] = useState(false);
  const apiBase = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(() => {
    document.title = 'Command Center | J. Worden & Sons';
  }, []);

  const fetchKpi = (key: string) => {
    setLoading(true);
    setAuthErr(false);
    fetch(`${apiBase}/api/v1/kpi/`, {
      headers: { 'X-Master-Key': key },
    })
      .then((r) => {
        if (r.status === 401 || r.status === 403) throw new Error('auth');
        if (!r.ok) throw new Error('err');
        return r.json();
      })
      .then((d: KpiData) => {
        setKpi(d);
        setAuthed(true);
      })
      .catch((e) => {
        if (e.message === 'auth') setAuthErr(true);
        setAuthed(false);
      })
      .finally(() => setLoading(false));
  };

  if (!authed) {
    return (
      <div className="bg-zinc-950 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="flex items-center gap-2 text-yellow-400 mb-4">
            <BarChart3 size={20} />
            <h1 className="font-black text-lg">Command Center</h1>
          </div>
          <p className="text-zinc-400 text-sm mb-6">Enter your master key to access the operations dashboard.</p>
          {authErr && (
            <p className="text-red-400 text-xs mb-3 font-medium">Invalid master key.</p>
          )}
          <input
            type="password"
            placeholder="Master key"
            value={authKey}
            onChange={(e) => setAuthKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchKpi(authKey)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2.5 mb-3 focus:outline-none focus:border-yellow-500"
          />
          <button
            onClick={() => fetchKpi(authKey)}
            disabled={!authKey}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-lg py-2.5 disabled:opacity-40 transition-colors"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading || !kpi) {
    return (
      <div className="bg-zinc-950 min-h-screen py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 h-20 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const netColor = kpi.cashflow.net_30d >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-zinc-950 min-h-screen py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-yellow-400 text-xs font-semibold mb-2">
              <BarChart3 size={12} /> Operations Dashboard
            </div>
            <h1 className="text-3xl font-black text-white">Command Center</h1>
          </div>
          <p className="text-zinc-600 text-xs">
            Updated {new Date(kpi.generated_at).toLocaleTimeString()}
          </p>
        </div>

        <Section title="Pipeline" icon={Target}>
          <StatCard label="Total Leads" value={fmt(kpi.pipeline.total_leads)} accent />
          <StatCard label="New This Month" value={kpi.pipeline.new_leads_mtd} />
          <StatCard label="Open Leads" value={kpi.pipeline.open_leads} />
          <StatCard label="Won YTD" value={kpi.pipeline.won_ytd} />
        </Section>

        <Section title="Proposals" icon={FileText}>
          <StatCard label="Total Proposals" value={kpi.proposals.total} />
          <StatCard label="Won" value={kpi.proposals.won} />
          <StatCard label="Win Rate" value={`${kpi.proposals.win_rate_pct}%`} accent />
        </Section>

        <Section title="Operations" icon={BarChart3}>
          <StatCard label="Active Jobs" value={kpi.jobs.active} sub={`${kpi.jobs.total} total`} />
          <StatCard label="Pending WOs" value={kpi.work_orders.pending} />
          <StatCard label="In Progress WOs" value={kpi.work_orders.in_progress} accent />
          <StatCard label="Completed MTD" value={kpi.work_orders.completed_mtd} />
        </Section>

        <Section title="Workforce" icon={Users}>
          <StatCard label="Active Crew" value={kpi.workforce.active_crew} accent />
          <StatCard label="Active Subs" value={kpi.workforce.active_subs} />
          <StatCard label="Total Headcount" value={kpi.workforce.total_headcount} />
        </Section>

        <Section title="Safety" icon={AlertTriangle}>
          <StatCard label="Incidents YTD" value={kpi.safety.incidents_ytd} />
          <StatCard label="Recordables YTD" value={kpi.safety.recordables_ytd} />
          <StatCard label="TRIR" value={kpi.safety.trir} sub="Industry avg: 3.4" accent={kpi.safety.trir > 3.4} />
        </Section>

        <Section title="Cash Flow (Last 30 Days)" icon={TrendingUp}>
          <StatCard label="Inflow" value={fmtCurrency(kpi.cashflow.inflow_30d)} />
          <StatCard label="Outflow" value={fmtCurrency(kpi.cashflow.outflow_30d)} />
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-zinc-500 text-xs font-medium mb-1">Net</p>
            <p className={`text-2xl font-black ${netColor}`}>{fmtCurrency(kpi.cashflow.net_30d)}</p>
          </div>
        </Section>

        <Section title="Market" icon={TrendingUp}>
          <StatCard label="VDOT Open Bids" value={kpi.market.vdot_open_bids} accent />
          <StatCard label="Total Tracked" value={kpi.market.vdot_total_tracked} />
        </Section>

        <Section title="Gallery" icon={Camera}>
          <StatCard label="Project Photos" value={kpi.gallery.photos_total} />
        </Section>
      </div>
    </div>
  );
}
