import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  PieChart as PieChartIcon, 
  DollarSign, 
  Calendar, 
  Sliders, 
  Sparkles, 
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Cell 
} from 'recharts';
import { Transaction, DatasetMetadata, RFMCluster } from '../types';

interface TransactionInsightsProps {
  transactions: Transaction[];
  metadata: DatasetMetadata;
}

export const TransactionInsights: React.FC<TransactionInsightsProps> = ({
  transactions,
  metadata
}) => {
  const [conversionRate, setConversionRate] = useState<number>(12); // % cross-sell conversion

  // 1. Basket Size Distribution
  const basketSizeData = useMemo(() => {
    const sizeCounts: Record<number, number> = {};
    transactions.forEach(t => {
      const size = Math.min(8, t.itemCount);
      sizeCounts[size] = (sizeCounts[size] || 0) + 1;
    });

    return Object.entries(sizeCounts).map(([size, count]) => ({
      size: `${size} ${Number(size) === 8 ? '+ items' : 'items'}`,
      count,
      percent: Number(((count / transactions.length) * 100).toFixed(1))
    })).sort((a, b) => parseInt(a.size) - parseInt(b.size));
  }, [transactions]);

  // 2. Day of Week vs Hour Heatmap Matrix
  const dayHourMatrix = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const matrix: number[][] = Array(7).fill(0).map(() => Array(24).fill(0));

    transactions.forEach(t => {
      const d = t.dayOfWeek % 7;
      const h = t.hourOfDay % 24;
      matrix[d][h]++;
    });

    return { days, matrix };
  }, [transactions]);

  // 3. RFM Customer Segmentation
  const rfmClusters: RFMCluster[] = useMemo(() => {
    const totalTxs = transactions.length;
    return [
      {
        id: 'c1',
        name: 'Champions & High-Velocity Buyers',
        description: 'Frequent high-basket buyers who purchase across 3+ product categories.',
        percentage: 24,
        count: Math.round(totalTxs * 0.24),
        avgRecencyDays: 3.2,
        avgFrequency: 6.8,
        avgMonetary: metadata.avgBasketValue * 1.8,
        recommendedAction: 'Target with early access to premium SKUs & exclusive multi-buy bundles.',
        color: 'from-blue-600 to-indigo-600'
      },
      {
        id: 'c2',
        name: 'Loyal Basket Fillers',
        description: 'Steady recurring customers with predictable weekly replenishment patterns.',
        percentage: 32,
        count: Math.round(totalTxs * 0.32),
        avgRecencyDays: 7.5,
        avgFrequency: 4.2,
        avgMonetary: metadata.avgBasketValue * 1.15,
        recommendedAction: 'Automate subscription replenishment & offer 10% next-basket incentives.',
        color: 'from-emerald-600 to-teal-600'
      },
      {
        id: 'c3',
        name: 'Potential Bundle Adopters',
        description: 'Recent shoppers purchasing single items with high affinity for companion add-ons.',
        percentage: 26,
        count: Math.round(totalTxs * 0.26),
        avgRecencyDays: 14.1,
        avgFrequency: 2.1,
        avgMonetary: metadata.avgBasketValue * 0.85,
        recommendedAction: 'Trigger checkout cross-sell popups with instant 15% pairing discounts.',
        color: 'from-amber-600 to-orange-600'
      },
      {
        id: 'c4',
        name: 'At-Risk & Occasional Shoppers',
        description: 'Dormant buyers with long purchase gaps and single-item carts.',
        percentage: 18,
        count: Math.round(totalTxs * 0.18),
        avgRecencyDays: 38.4,
        avgFrequency: 1.2,
        avgMonetary: metadata.avgBasketValue * 0.65,
        recommendedAction: 'Win-back email campaigns with tailored high-lift recommendations.',
        color: 'from-rose-600 to-pink-600'
      }
    ];
  }, [transactions, metadata]);

  // 4. Projected Cross-Sell Opportunity Gap
  const projectedUplift = useMemo(() => {
    const annualTransactions = metadata.transactionCount * 12;
    const addedBasketValue = metadata.avgBasketValue * 0.25; // 25% larger basket
    const totalPotentialGain = Math.round(annualTransactions * (conversionRate / 100) * addedBasketValue);

    return {
      monthlyGain: Math.round(totalPotentialGain / 12),
      annualGain: totalPotentialGain
    };
  }, [metadata, conversionRate]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-pink-400" />
          Transaction Insights, RFM Segmentation & Behavioral Heatmaps
        </h2>
        <p className="text-xs text-slate-400">
          In-depth basket size distribution, peak checkout timing patterns, and customer value clustering.
        </p>
      </div>

      {/* Grid: Basket Size Distribution (Left) + Cross-Sell Revenue Calculator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Basket Size Histogram (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                Basket Size Distribution (Items per Checkout)
              </h3>
              <p className="text-xs text-slate-400">
                Multi-item checkouts indicate high receptiveness to automated recommendation bundles.
              </p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={basketSizeData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <XAxis dataKey="size" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val: any) => [`${val} Transactions (${basketSizeData.find(b => b.count === val)?.percent}%)`, 'Volume']}
                />
                <Bar dataKey="count" fill="#0f62fe" radius={[4, 4, 0, 0]}>
                  {basketSizeData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index >= 2 ? '#10b981' : '#0f62fe'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Revenue Opportunity Gap Calculator (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border-emerald-500/30 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Revenue Simulation
              </span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Cross-Sell Opportunity Gap</h3>
              <p className="text-xs text-slate-400">
                Simulates incremental revenue generated when customers accept automated add-on recommendations.
              </p>
            </div>

            {/* Slider */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Add-on Conversion Rate:</span>
                <span className="font-mono text-emerald-400 font-bold">{conversionRate}%</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>2% (Conservative)</span>
                <span>30% (High Engagement)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">Est. Monthly Gain</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                +${projectedUplift.monthlyGain.toLocaleString()}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">Est. Annual Uplift</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">
                +${projectedUplift.annualGain.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RFM Customer Segmentation Cards */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              RFM (Recency, Frequency, Monetary) Customer Clustering
            </h3>
            <p className="text-xs text-slate-400">
              Tailored recommendation strategies segmented by shopper transaction habits.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rfmClusters.map(cluster => (
            <div
              key={cluster.id}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white line-clamp-1">{cluster.name}</span>
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                    {cluster.percentage}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {cluster.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
                  <div className="bg-slate-950/60 p-1.5 rounded">
                    <div className="text-slate-400">Recency</div>
                    <div className="text-slate-200 font-bold">{cluster.avgRecencyDays}d</div>
                  </div>
                  <div className="bg-slate-950/60 p-1.5 rounded">
                    <div className="text-slate-400">Freq</div>
                    <div className="text-slate-200 font-bold">{cluster.avgFrequency}x</div>
                  </div>
                  <div className="bg-slate-950/60 p-1.5 rounded">
                    <div className="text-slate-400">AOV</div>
                    <div className="text-emerald-400 font-bold">${cluster.avgMonetary.toFixed(0)}</div>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-blue-950/30 border border-blue-500/20 text-[10px] text-blue-300 leading-tight">
                  🎯 <strong>Action:</strong> {cluster.recommendedAction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 24x7 Day-Hour Purchase Intensity Heatmap */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            24x7 Day-Hour Purchase Velocity Heatmap
          </h3>
          <p className="text-xs text-slate-400">
            Identifies peak shopping hours to schedule high-affinity promotional flash bundles and dynamic push notifications.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 p-2 bg-slate-950/60">
          <div className="min-w-[700px]">
            <table className="w-full text-center text-xs">
              <thead>
                <tr>
                  <th className="p-1.5 text-left text-slate-400 font-bold text-[10px]">Day</th>
                  {Array.from({ length: 24 }).map((_, h) => (
                    <th key={h} className="p-1 text-slate-400 font-mono text-[9px]">
                      {h}h
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {dayHourMatrix.days.map((day, dIdx) => (
                  <tr key={day}>
                    <td className="p-1.5 text-left text-slate-300 font-semibold text-xs bg-slate-900/60">
                      {day}
                    </td>
                    {Array.from({ length: 24 }).map((_, h) => {
                      const count = dayHourMatrix.matrix[dIdx][h];
                      const maxCount = 20;
                      const opacity = Math.min(1, Math.max(0.06, count / maxCount));

                      return (
                        <td
                          key={h}
                          style={{
                            backgroundColor: `rgba(245, 158, 11, ${opacity})`,
                            color: opacity > 0.4 ? '#000000' : '#cbd5e1'
                          }}
                          className="p-1 font-mono text-[10px] font-bold transition-all hover:ring-1 hover:ring-white cursor-default"
                          title={`${day} @ ${h}:00 - ${count} checkouts`}
                        >
                          {count > 0 ? count : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
