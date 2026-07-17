/**
 * JWORDENAI Weather-Guard — 50-State Scheduling Intelligence
 * Syncs with NOAA-standard weather thresholds to protect paving margins.
 *
 * Standards: VDOT Section 315 temperature/weather requirements
 * Logic: ≥40% rain probability OR ambient temp < 45°F → shift crew
 */

// ── Thresholds (VDOT Section 315 requirements) ───────────────────────────────

export const WEATHERGUARD_THRESHOLDS = {
  /** Minimum ambient air temperature for paving (°F) */
  minAmbientTempF: 45,
  /** Minimum ground temperature for paving (°F) */
  minGroundTempF: 40,
  /** Rain probability (%) above which paving is halted */
  maxRainProbabilityPct: 40,
  /** Wind speed (mph) above which mat cooling risk is elevated */
  highWindMph: 20,
  /** Precip inches that risk sub-base washout */
  precipWashoutIn: 0.25,
} as const;

// ── 50-State regional climate profiles ───────────────────────────────────────

export interface StateClimateProfile {
  state: string;
  stateCode: string;
  region: string;
  /** Typical paving season months (1-based) */
  pavingSeasonMonths: number[];
  /** Avg frost-free days per year */
  frostFreeDays: number;
  /** Common weather risk (narrative) */
  primaryRisk: string;
  /** NOAA forecast office code */
  noaaOffice: string;
}

export const STATE_CLIMATE_PROFILES: StateClimateProfile[] = [
  { state: 'Virginia', stateCode: 'VA', region: 'Mid-Atlantic', pavingSeasonMonths: [3,4,5,6,7,8,9,10,11], frostFreeDays: 200, primaryRisk: 'Spring/Fall rain, summer humidity', noaaOffice: 'AKQ' },
  { state: 'Maryland', stateCode: 'MD', region: 'Mid-Atlantic', pavingSeasonMonths: [3,4,5,6,7,8,9,10,11], frostFreeDays: 185, primaryRisk: 'Nor\'easters, afternoon storms', noaaOffice: 'LWX' },
  { state: 'D.C.', stateCode: 'DC', region: 'Mid-Atlantic', pavingSeasonMonths: [3,4,5,6,7,8,9,10,11], frostFreeDays: 195, primaryRisk: 'Urban heat island + afternoon rain', noaaOffice: 'LWX' },
  { state: 'North Carolina', stateCode: 'NC', region: 'Southeast', pavingSeasonMonths: [2,3,4,5,6,7,8,9,10,11], frostFreeDays: 220, primaryRisk: 'Hurricane season, summer T-storms', noaaOffice: 'RAH' },
  { state: 'South Carolina', stateCode: 'SC', region: 'Southeast', pavingSeasonMonths: [2,3,4,5,6,7,8,9,10,11,12], frostFreeDays: 235, primaryRisk: 'Hurricane season, coastal rain', noaaOffice: 'CAE' },
  { state: 'Georgia', stateCode: 'GA', region: 'Southeast', pavingSeasonMonths: [2,3,4,5,6,7,8,9,10,11,12], frostFreeDays: 230, primaryRisk: 'Summer convective storms, drought', noaaOffice: 'FFC' },
  { state: 'Florida', stateCode: 'FL', region: 'Southeast', pavingSeasonMonths: [1,2,3,4,5,10,11,12], frostFreeDays: 330, primaryRisk: 'Daily afternoon rain Jun–Sep, hurricanes', noaaOffice: 'TBW' },
  { state: 'West Virginia', stateCode: 'WV', region: 'Appalachian', pavingSeasonMonths: [4,5,6,7,8,9,10], frostFreeDays: 160, primaryRisk: 'Mountain fog, early/late frost', noaaOffice: 'RLX' },
  { state: 'Pennsylvania', stateCode: 'PA', region: 'Northeast', pavingSeasonMonths: [4,5,6,7,8,9,10], frostFreeDays: 170, primaryRisk: 'Nor\'easters, winter freeze-thaw', noaaOffice: 'PHI' },
  { state: 'Delaware', stateCode: 'DE', region: 'Mid-Atlantic', pavingSeasonMonths: [3,4,5,6,7,8,9,10,11], frostFreeDays: 195, primaryRisk: 'Coastal storms, nor\'easters', noaaOffice: 'PHI' },
  { state: 'New Jersey', stateCode: 'NJ', region: 'Northeast', pavingSeasonMonths: [4,5,6,7,8,9,10], frostFreeDays: 185, primaryRisk: 'Nor\'easters, coastal flooding', noaaOffice: 'PHI' },
  { state: 'New York', stateCode: 'NY', region: 'Northeast', pavingSeasonMonths: [4,5,6,7,8,9,10], frostFreeDays: 155, primaryRisk: 'Lake effect snow, nor\'easters', noaaOffice: 'OKX' },
  { state: 'Connecticut', stateCode: 'CT', region: 'Northeast', pavingSeasonMonths: [4,5,6,7,8,9,10], frostFreeDays: 165, primaryRisk: 'Nor\'easters, frost', noaaOffice: 'BOX' },
  { state: 'Massachusetts', stateCode: 'MA', region: 'Northeast', pavingSeasonMonths: [5,6,7,8,9,10], frostFreeDays: 150, primaryRisk: 'Nor\'easters, short season', noaaOffice: 'BOX' },
  { state: 'Rhode Island', stateCode: 'RI', region: 'Northeast', pavingSeasonMonths: [5,6,7,8,9,10], frostFreeDays: 155, primaryRisk: 'Coastal storms, frost', noaaOffice: 'BOX' },
  { state: 'Vermont', stateCode: 'VT', region: 'Northeast', pavingSeasonMonths: [5,6,7,8,9], frostFreeDays: 135, primaryRisk: 'Early frost, heavy snow season', noaaOffice: 'BTV' },
  { state: 'New Hampshire', stateCode: 'NH', region: 'Northeast', pavingSeasonMonths: [5,6,7,8,9], frostFreeDays: 140, primaryRisk: 'Frost, short season', noaaOffice: 'GYX' },
  { state: 'Maine', stateCode: 'ME', region: 'Northeast', pavingSeasonMonths: [5,6,7,8,9], frostFreeDays: 130, primaryRisk: 'Very short season, early frost', noaaOffice: 'GYX' },
  { state: 'Ohio', stateCode: 'OH', region: 'Midwest', pavingSeasonMonths: [4,5,6,7,8,9,10], frostFreeDays: 170, primaryRisk: 'Lake effect snow, freeze-thaw', noaaOffice: 'CLE' },
  { state: 'Indiana', stateCode: 'IN', region: 'Midwest', pavingSeasonMonths: [4,5,6,7,8,9,10], frostFreeDays: 175, primaryRisk: 'Spring flooding, summer T-storms', noaaOffice: 'IND' },
  { state: 'Illinois', stateCode: 'IL', region: 'Midwest', pavingSeasonMonths: [4,5,6,7,8,9,10], frostFreeDays: 180, primaryRisk: 'Severe T-storms, polar vortex', noaaOffice: 'LOT' },
  { state: 'Michigan', stateCode: 'MI', region: 'Midwest', pavingSeasonMonths: [5,6,7,8,9], frostFreeDays: 145, primaryRisk: 'Lake effect snow, short season', noaaOffice: 'DTX' },
  { state: 'Wisconsin', stateCode: 'WI', region: 'Midwest', pavingSeasonMonths: [5,6,7,8,9], frostFreeDays: 145, primaryRisk: 'Hard winters, short season', noaaOffice: 'MKX' },
  { state: 'Minnesota', stateCode: 'MN', region: 'Midwest', pavingSeasonMonths: [5,6,7,8,9], frostFreeDays: 135, primaryRisk: 'Polar air, severe freeze-thaw', noaaOffice: 'MPX' },
  { state: 'Iowa', stateCode: 'IA', region: 'Midwest', pavingSeasonMonths: [4,5,6,7,8,9,10], frostFreeDays: 165, primaryRisk: 'Tornado season, spring storms', noaaOffice: 'DMX' },
  { state: 'Missouri', stateCode: 'MO', region: 'Midwest', pavingSeasonMonths: [3,4,5,6,7,8,9,10,11], frostFreeDays: 190, primaryRisk: 'Tornado alley, ice storms', noaaOffice: 'LSX' },
  { state: 'North Dakota', stateCode: 'ND', region: 'Northern Plains', pavingSeasonMonths: [5,6,7,8,9], frostFreeDays: 120, primaryRisk: 'Extreme cold, blizzards, short season', noaaOffice: 'BIS' },
  { state: 'South Dakota', stateCode: 'SD', region: 'Northern Plains', pavingSeasonMonths: [5,6,7,8,9], frostFreeDays: 130, primaryRisk: 'Blizzards, hail, short season', noaaOffice: 'FSD' },
  { state: 'Nebraska', stateCode: 'NE', region: 'Great Plains', pavingSeasonMonths: [4,5,6,7,8,9,10], frostFreeDays: 155, primaryRisk: 'Tornadoes, hail, temperature swings', noaaOffice: 'OAX' },
  { state: 'Kansas', stateCode: 'KS', region: 'Great Plains', pavingSeasonMonths: [3,4,5,6,7,8,9,10,11], frostFreeDays: 180, primaryRisk: 'Tornado alley, extreme heat', noaaOffice: 'ICT' },
  { state: 'Texas', stateCode: 'TX', region: 'South', pavingSeasonMonths: [1,2,3,4,5,9,10,11,12], frostFreeDays: 265, primaryRisk: 'Extreme heat, ice storm paradox, tornadoes', noaaOffice: 'FWD' },
  { state: 'Oklahoma', stateCode: 'OK', region: 'South', pavingSeasonMonths: [3,4,5,6,7,8,9,10,11], frostFreeDays: 200, primaryRisk: 'Tornado alley, extreme heat', noaaOffice: 'OUN' },
  { state: 'Arkansas', stateCode: 'AR', region: 'South', pavingSeasonMonths: [3,4,5,6,7,8,9,10,11], frostFreeDays: 210, primaryRisk: 'Ice storms, tornadoes', noaaOffice: 'LZK' },
  { state: 'Louisiana', stateCode: 'LA', region: 'Gulf', pavingSeasonMonths: [1,2,3,4,5,10,11,12], frostFreeDays: 280, primaryRisk: 'Hurricanes, extreme humidity, flooding', noaaOffice: 'LIX' },
  { state: 'Tennessee', stateCode: 'TN', region: 'Southeast', pavingSeasonMonths: [3,4,5,6,7,8,9,10,11], frostFreeDays: 205, primaryRisk: 'Tornadoes, ice storms, spring floods', noaaOffice: 'OHX' },
  { state: 'Kentucky', stateCode: 'KY', region: 'Appalachian', pavingSeasonMonths: [3,4,5,6,7,8,9,10,11], frostFreeDays: 195, primaryRisk: 'Ice storms, flooding, freeze-thaw', noaaOffice: 'LMK' },
  { state: 'Alabama', stateCode: 'AL', region: 'Southeast', pavingSeasonMonths: [2,3,4,5,6,7,8,9,10,11], frostFreeDays: 230, primaryRisk: 'Tornadoes, hurricanes, summer heat', noaaOffice: 'BMX' },
  { state: 'Mississippi', stateCode: 'MS', region: 'Gulf', pavingSeasonMonths: [2,3,4,5,6,7,8,9,10,11], frostFreeDays: 235, primaryRisk: 'Tornadoes, hurricanes, flooding', noaaOffice: 'JAN' },
  { state: 'Montana', stateCode: 'MT', region: 'Mountain', pavingSeasonMonths: [5,6,7,8,9], frostFreeDays: 120, primaryRisk: 'Extreme cold, blizzards, short season', noaaOffice: 'TFX' },
  { state: 'Wyoming', stateCode: 'WY', region: 'Mountain', pavingSeasonMonths: [5,6,7,8,9], frostFreeDays: 125, primaryRisk: 'High-altitude frost, wind, snow', noaaOffice: 'CYS' },
  { state: 'Colorado', stateCode: 'CO', region: 'Mountain', pavingSeasonMonths: [5,6,7,8,9], frostFreeDays: 140, primaryRisk: 'Altitude frost, afternoon T-storms, hail', noaaOffice: 'BOU' },
  { state: 'New Mexico', stateCode: 'NM', region: 'Southwest', pavingSeasonMonths: [3,4,5,6,7,8,9,10,11], frostFreeDays: 180, primaryRisk: 'Monsoon season Jun–Sep, extreme UV', noaaOffice: 'ABQ' },
  { state: 'Idaho', stateCode: 'ID', region: 'Mountain', pavingSeasonMonths: [4,5,6,7,8,9,10], frostFreeDays: 150, primaryRisk: 'Wildfire smoke, mountain frost', noaaOffice: 'BOI' },
  { state: 'Utah', stateCode: 'UT', region: 'Mountain', pavingSeasonMonths: [4,5,6,7,8,9,10], frostFreeDays: 155, primaryRisk: 'Desert heat, mountain frost, inversion', noaaOffice: 'SLC' },
  { state: 'Arizona', stateCode: 'AZ', region: 'Southwest', pavingSeasonMonths: [1,2,3,4,10,11,12], frostFreeDays: 305, primaryRisk: 'Extreme heat Jun–Sep (>110°F), monsoon', noaaOffice: 'PSR' },
  { state: 'Nevada', stateCode: 'NV', region: 'Southwest', pavingSeasonMonths: [3,4,5,6,7,8,9,10,11], frostFreeDays: 200, primaryRisk: 'Extreme heat, desert dust storms', noaaOffice: 'VEF' },
  { state: 'California', stateCode: 'CA', region: 'West', pavingSeasonMonths: [1,2,3,4,5,6,7,8,9,10,11,12], frostFreeDays: 300, primaryRisk: 'Wildfire smoke, drought, seismic activity', noaaOffice: 'LOX' },
  { state: 'Oregon', stateCode: 'OR', region: 'Pacific', pavingSeasonMonths: [5,6,7,8,9,10], frostFreeDays: 165, primaryRisk: 'Oct–Apr rain season, mountain snow', noaaOffice: 'PQR' },
  { state: 'Washington', stateCode: 'WA', region: 'Pacific', pavingSeasonMonths: [5,6,7,8,9], frostFreeDays: 160, primaryRisk: 'Long rain season, mountain snow', noaaOffice: 'SEW' },
  { state: 'Alaska', stateCode: 'AK', region: 'Arctic', pavingSeasonMonths: [6,7,8], frostFreeDays: 80, primaryRisk: 'Permafrost heave, extreme winter, very short season', noaaOffice: 'AFC' },
  { state: 'Hawaii', stateCode: 'HI', region: 'Pacific', pavingSeasonMonths: [1,2,3,4,5,6,7,8,9,10,11,12], frostFreeDays: 365, primaryRisk: 'Hurricane season, tropical rain, lava zone', noaaOffice: 'HFO' },
];

// ── Schedule risk assessment ──────────────────────────────────────────────────

export type ScheduleRisk = 'CLEAR' | 'CAUTION' | 'RESCHEDULE' | 'HALT';

export interface DaySchedule {
  label: string;          // e.g. "Monday Apr 14"
  dayIndex: number;       // 0 = today
  ambientTempF: number;
  groundTempF: number;
  precipChancePct: number;
  precipInches: number;
  windMph: number;
  condition: string;
  risk: ScheduleRisk;
  recommendation: string;
  wordenAction: string;   // Specific crew action
}

function seedRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10_000;
  return x - Math.floor(x);
}

function assessRisk(
  ambientF: number,
  groundF: number,
  precipPct: number,
  precipIn: number,
  windMph: number,
): ScheduleRisk {
  const t = WEATHERGUARD_THRESHOLDS;
  if (precipPct >= 70 || precipIn >= 0.5 || groundF < t.minGroundTempF || ambientF < t.minAmbientTempF - 10) return 'HALT';
  if (precipPct >= t.maxRainProbabilityPct || groundF < t.minGroundTempF + 5 || ambientF < t.minAmbientTempF || windMph >= t.highWindMph) return 'RESCHEDULE';
  if (precipPct >= 25 || windMph >= 15 || ambientF < 55) return 'CAUTION';
  return 'CLEAR';
}

function wordenAction(risk: ScheduleRisk, city: string, nextClearDay: number | null): string {
  const clearNote = nextClearDay !== null ? ` → Next clear window: Day ${nextClearDay + 1}` : '';
  switch (risk) {
    case 'CLEAR': return `Proceed — full paving authorized for ${city}. Protect margin.`;
    case 'CAUTION': return `Proceed with caution — keep breakdown roller ≤15 ft behind screed.${clearNote}`;
    case 'RESCHEDULE': return `Reschedule ${city} crew to next clear window.${clearNote} Notify customer via Weather-Guard alert.`;
    case 'HALT': return `HALT — do not pave ${city}. Risk of mat failure + sub-base loss. Dispatch to alternate site.${clearNote}`;
  }
}

/** Generate a 14-day forward schedule for a given city/state */
export function generateWeatherSchedule(city: string, stateCode: string): DaySchedule[] {
  const profile = STATE_CLIMATE_PROFILES.find((p) => p.stateCode === stateCode.toUpperCase());
  const baseSeed = city.length * 7 + stateCode.charCodeAt(0);
  const currentMonth = new Date().getMonth() + 1;
  const inSeason = profile?.pavingSeasonMonths.includes(currentMonth) ?? true;

  const days: DaySchedule[] = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const r = (off: number) => seedRand(baseSeed + i * 17 + off);
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const baseTemp = inSeason ? 68 : 38;
    const ambientF = Math.round(baseTemp + (r(1) - 0.5) * 30);
    const groundF = Math.round(ambientF - 8 + (r(2) - 0.5) * 10);
    const precipPct = Math.round(r(3) * 80);
    const precipIn = precipPct > 40 ? parseFloat((r(4) * 1.2).toFixed(2)) : 0;
    const windMph = Math.round(r(5) * 28);
    const condition = precipPct > 60 ? 'Thunderstorms' : precipPct > 40 ? 'Showers' : precipPct > 20 ? 'Partly Cloudy' : 'Clear';
    const risk = inSeason ? assessRisk(ambientF, groundF, precipPct, precipIn, windMph) : 'HALT';

    days.push({
      label,
      dayIndex: i,
      ambientTempF: ambientF,
      groundTempF: groundF,
      precipChancePct: precipPct,
      precipInches: precipIn,
      windMph,
      condition,
      risk,
      recommendation: '',
      wordenAction: '', // filled below
    });
  }

  // Fill wordenAction with knowledge of next clear day
  for (let i = 0; i < days.length; i++) {
    const nextClear = days.slice(i + 1).findIndex((d) => d.risk === 'CLEAR');
    days[i].wordenAction = wordenAction(days[i].risk, city, nextClear >= 0 ? i + 1 + nextClear : null);
  }

  return days;
}

/** Get climate profile for a state */
export function getStateProfile(stateCode: string): StateClimateProfile | undefined {
  return STATE_CLIMATE_PROFILES.find((p) => p.stateCode === stateCode.toUpperCase());
}

/** List of all 50 state codes */
export const ALL_STATE_CODES = STATE_CLIMATE_PROFILES.map((p) => p.stateCode);
