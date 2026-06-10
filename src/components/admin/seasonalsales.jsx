// src/components/admin/seasonalsales.jsx
import { useState, useEffect, useCallback } from 'react';
import api from '../api/base';
import toast from 'react-hot-toast';
import { Loader2, Zap, Calendar, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react';

const SEASONS = [
  {
    key: 'dashain',
    name: 'Dashain Mahotsav',
    emoji: '🎉',
    color: '#E85D04',
    bg: 'from-orange-500 to-red-500',
    dates: 'Oct 1 – Oct 15',
    description: 'Biggest festival sale of the year',
  },
  {
    key: 'tihar',
    name: 'Tihar Utsav',
    emoji: '🪔',
    color: '#F59E0B',
    bg: 'from-yellow-500 to-amber-500',
    dates: 'Oct 20 – Nov 5',
    description: 'Festival of lights — special offers',
  },
  {
    key: 'new_year',
    name: 'New Year Bonanza',
    emoji: '🎆',
    color: '#8B5CF6',
    bg: 'from-purple-500 to-violet-600',
    dates: 'Dec 28 – Jan 5',
    description: 'Ring in the new year with deals',
  },
  {
    key: 'summer',
    name: 'Summer Clearance',
    emoji: '🌞',
    color: '#0EA5E9',
    bg: 'from-sky-500 to-blue-500',
    dates: 'May 1 – Jul 31',
    description: 'Beat the heat with hot savings',
  },
  {
    key: 'winter',
    name: 'Winter Sale',
    emoji: '❄️',
    color: '#1D4ED8',
    bg: 'from-blue-600 to-indigo-700',
    dates: 'Nov 15 – Jan 31',
    description: 'Warm up your wardrobe for less',
  },
];

function CountdownTimer({ targetDate, label }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0, ended: false });
  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = new Date(targetDate) - Date.now();
      if (diff <= 0) { setT({ d: 0, h: 0, m: 0, s: 0, ended: true }); return; }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        ended: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!targetDate) return null;
  if (t.ended) return <span className="text-xs text-red-500 font-medium">Ended</span>;

  return (
    <div className="flex items-center gap-1 text-xs">
      <Clock className="w-3 h-3 opacity-60" />
      <span className="font-medium opacity-70">{label}:</span>
      <span className="font-bold">
        {t.d > 0 ? `${t.d}d ` : ''}{String(t.h).padStart(2, '0')}:{String(t.m).padStart(2, '0')}:{String(t.s).padStart(2, '0')}
      </span>
    </div>
  );
}

function getSeasonStatus(saleCategories, seasonKey) {
  const matched = saleCategories.filter(c => c.season === seasonKey);
  if (!matched.length) return { status: 'no_sales', activeSales: 0, totalSales: 0 };
  const now = new Date().toISOString();
  const active = matched.filter(c => {
    if (!c.is_active) return false;
    if (c.start_date && c.start_date > now) return false;
    if (c.end_date && c.end_date < now) return false;
    return true;
  });
  return { status: active.length > 0 ? 'active' : 'inactive', activeSales: active.length, totalSales: matched.length, matched };
}

export default function SeasonalSales() {
  const [saleCategories, setSaleCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/sale-categories');
      const raw = res.data?.data ?? [];
      setSaleCategories(Array.isArray(raw) ? raw : (raw.items ?? []));
    } catch {
      setSaleCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const activateSeason = async (seasonKey) => {
    if (!window.confirm(`Activate all "${seasonKey}" sale categories? This will set their dates and mark them active.`)) return;
    setActivating(seasonKey);
    try {
      const res = await api.post('/sale-categories/activate-season', { season: seasonKey });
      const count = res.data?.data?.updatedCount ?? 0;
      if (count === 0) {
        toast.error('No sale categories tagged with this season found. Tag them first in Sale Categories.');
      } else {
        toast.success(`${count} sale categor${count === 1 ? 'y' : 'ies'} activated!`);
        await load();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Activation failed');
    } finally {
      setActivating(null);
    }
  };

  const now = new Date();
  const currentYear = now.getFullYear();
  const SEASON_NEXT_DATES = {
    dashain:  new Date(`${currentYear}-10-01`),
    tihar:    new Date(`${currentYear}-10-20`),
    new_year: new Date(`${currentYear}-12-28`),
    summer:   new Date(`${currentYear + (now.getMonth() >= 7 ? 1 : 0)}-05-01`),
    winter:   new Date(`${currentYear + (now.getMonth() >= 11 ? 1 : 0)}-11-15`),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seasonal Sales Manager</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Activate predefined season windows — all tagged sale categories go live automatically
        </p>
      </div>

      {/* How it works */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-blue-900 text-sm">How seasonal activation works</p>
          <p className="text-blue-700 text-xs mt-1 leading-relaxed">
            Tag sale categories with a season in <strong>Sale Categories</strong> (field: Season).
            Clicking <strong>Activate</strong> below marks all categories with that season as active
            and sets their start/end dates to the predefined window for this year.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-[#FF6B35]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {SEASONS.map((season) => {
            const { status, activeSales, totalSales, matched } = getSeasonStatus(saleCategories, season.key);
            const nextDate = SEASON_NEXT_DATES[season.key];
            const isActivating = activating === season.key;
            const isActive = status === 'active';
            const hasAnySales = totalSales > 0;

            return (
              <div key={season.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Banner */}
                <div className={`bg-gradient-to-r ${season.bg} p-5`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-3xl mb-2">{season.emoji}</div>
                      <h3 className="text-white font-bold text-lg leading-tight">{season.name}</h3>
                      <p className="text-white/70 text-xs mt-0.5">{season.description}</p>
                    </div>
                    {isActive && (
                      <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        LIVE
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                  {/* Dates */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="font-medium">{season.dates}</span>
                    {matched?.[0]?.end_date && (
                      <CountdownTimer
                        targetDate={isActive ? matched[0].end_date : nextDate.toISOString()}
                        label={isActive ? 'ends in' : 'starts in'}
                      />
                    )}
                    {!matched?.[0]?.end_date && (
                      <CountdownTimer targetDate={nextDate.toISOString()} label="next" />
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : hasAnySales ? (
                      <Clock className="w-4 h-4 text-amber-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={`text-sm font-medium ${isActive ? 'text-emerald-700' : hasAnySales ? 'text-amber-700' : 'text-gray-500'}`}>
                      {isActive
                        ? `Active — ${activeSales} sale${activeSales !== 1 ? 's' : ''} live`
                        : hasAnySales
                        ? `${totalSales} sale${totalSales !== 1 ? 's' : ''} tagged — not yet active`
                        : 'No sale categories tagged'}
                    </span>
                  </div>

                  {/* Tagged sales list (collapsed preview) */}
                  {matched && matched.length > 0 && (
                    <div className="space-y-1">
                      {matched.slice(0, 3).map(c => (
                        <div key={c.id} className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                          <ChevronRight className="w-3 h-3 shrink-0" />
                          <span className="truncate flex-1">{c.title}</span>
                          <span className={`px-1.5 py-0.5 rounded-full font-semibold ${c.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'}`}>
                            {c.is_active ? 'On' : 'Off'}
                          </span>
                        </div>
                      ))}
                      {matched.length > 3 && (
                        <p className="text-xs text-gray-400 pl-3">+{matched.length - 3} more</p>
                      )}
                    </div>
                  )}

                  {/* Activate button */}
                  <button
                    onClick={() => activateSeason(season.key)}
                    disabled={isActivating || !hasAnySales}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
                      !hasAnySales
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isActive
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : `bg-gradient-to-r ${season.bg} text-white shadow-md hover:opacity-90`
                    }`}
                  >
                    {isActivating ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Activating…</>
                    ) : !hasAnySales ? (
                      'No sales to activate'
                    ) : isActive ? (
                      <>Re-activate Season</>
                    ) : (
                      <><Zap className="w-4 h-4" /> Activate {season.name}</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
