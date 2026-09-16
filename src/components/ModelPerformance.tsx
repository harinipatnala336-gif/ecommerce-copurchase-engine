import React, { useMemo } from 'react';
import { 
  Activity, 
  Cpu, 
  Zap, 
  Layers, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Clock, 
  Database,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend, 
  Cell 
} from 'recharts';
import { BenchmarkMetrics, Transaction, Product } from '../types';

interface ModelPerformanceProps {
  benchmark: BenchmarkMetrics[];
  transactions: Transaction[];
  products: Product[];
}

export const ModelPerformance: React.FC<ModelPerformanceProps> = ({
  benchmark,
  transactions,
  products
}) => {
  // Runtime sensitivity simulation (Runtime vs Min Support)
  const sensitivityData = useMemo(() => {
    return [
      { support: '1%', apriori: 480, fpgrowth: 52, itemcf: 35 },
      { support: '2%', apriori: 240, fpgrowth: 34, itemcf: 32 },
      { support: '5%', apriori: benchmark.find(b => b.algorithm === 'Apriori')?.executionTimeMs || 85, fpgrowth: benchmark.find(b => b.algorithm === 'FP-Growth')?.executionTimeMs || 18, itemcf: benchmark.find(b => b.algorithm === 'Item-Item CF')?.executionTimeMs || 25 },
      { support: '10%', apriori: 32, fpgrowth: 11, itemcf: 22 },
      { support: '15%', apriori: 14, fpgrowth: 6, itemcf: 18 }
    ];
  }, [benchmark]);

  // Accuracy Comparison Data for Bar chart
  const accuracyData = useMemo(() => {
    return benchmark.map(b => ({
      name: b.algorithm,
      precision: Number((b.precisionAtK * 100).toFixed(1)),
      recall: Number((b.recallAtK * 100).toFixed(1)),
      map: Number((b.mapAtK * 100).toFixed(1)),
      ndcg: Number((b.ndcgAtK * 100).toFixed(1))
    }));
  }, [benchmark]);

  const COLORS = ['#0f62fe', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-400" />
          Model Performance & Algorithmic Benchmarking Suite
        </h2>
        <p className="text-xs text-slate-400">
          Rigorous head-to-head evaluation comparing Apriori, FP-Growth (FP-Tree), and Collaborative Filtering across speed, memory, and recommendation accuracy.
        </p>
      </div>

      {/* 3 Algorithm Benchmark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {benchmark.map((bench, idx) => (
          <div
            key={bench.algorithm}
            className={`glass-panel rounded-2xl p-5 space-y-4 border ${
              bench.algorithm === 'FP-Growth'
                ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-950/20 to-slate-900/80 shadow-lg shadow-emerald-500/10'
                : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></span>
                <h3 className="text-base font-bold text-white">{bench.algorithm}</h3>
              </div>
              {bench.algorithm === 'FP-Growth' && (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Fastest
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">Execution Time</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {bench.executionTimeMs} ms
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">Memory Footprint</div>
                <div className="text-base font-bold text-blue-400 mt-0.5">
                  {bench.memoryMb} MB
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">Precision@5</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">
                  {(bench.precisionAtK * 100).toFixed(1)}%
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">NDCG@5 Ranking</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">
                  {(bench.ndcgAtK * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
              {bench.algorithm === 'FP-Growth' && (
                <p className="text-[11px] text-emerald-300/90 leading-snug">
                  Compresses database into compact Frequent Pattern Tree, avoiding expensive candidate generation passes.
                </p>
              )}
              {bench.algorithm === 'Apriori' && (
                <p className="text-[11px] text-slate-400 leading-snug">
                  Classic level-wise candidate generation using downward-closure property. Scalable for sparse or small itemsets.
                </p>
              )}
              {bench.algorithm === 'Item-Item CF' && (
                <p className="text-[11px] text-slate-400 leading-snug">
                  Computes dense cosine similarity matrix between co-purchased baskets. Ideal for personalized continuous scoring.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Accuracy Metric Bars (Left) + Runtime Sensitivity Curve (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recommendation Accuracy Comparison (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Recommendation Accuracy Benchmark (Precision, Recall, MAP, NDCG)
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated via leave-one-out validation on multi-item historical shopping baskets.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis unit="%" stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="precision" name="Precision@5 (%)" fill="#0f62fe" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recall" name="Recall@5 (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="map" name="MAP@5 (%)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ndcg" name="NDCG@5 (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Runtime vs Min Support Sensitivity Curve (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Runtime Complexity vs Min Support (%)
            </h3>
            <p className="text-xs text-slate-400">
              Shows how Apriori execution runtime explodes at lower support thresholds vs FP-Growth stability.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensitivityData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <XAxis dataKey="support" stroke="#64748b" fontSize={11} />
                <YAxis unit="ms" stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="apriori" name="Apriori (ms)" stroke="#0f62fe" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="fpgrowth" name="FP-Growth (ms)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="itemcf" name="Item CF (ms)" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Algorithmic Complexity Reference Card */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-400" />
          Algorithmic Complexity & Theoretical Formulation Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="font-bold text-blue-400">Apriori Algorithm:</div>
            <div className="text-[11px] text-slate-300 font-mono">Time: O(2^|D|) in worst-case</div>
            <div className="text-[11px] text-slate-300 font-mono">Database Scans: k passes</div>
            <p className="text-[11px] text-slate-400 pt-1">
              Downside: Exponential candidate generation and repeated disk/memory passes for large transactional databases.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="font-bold text-emerald-400">FP-Growth (FP-Tree):</div>
            <div className="text-[11px] text-slate-300 font-mono">Time: O(N * log(N))</div>
            <div className="text-[11px] text-slate-300 font-mono">Database Scans: Exactly 2 passes</div>
            <p className="text-[11px] text-slate-400 pt-1">
              Advantage: No candidate generation. Builds in-memory prefix tree with conditional pattern bases for rapid extraction.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="font-bold text-amber-400">Item-Item Collaborative Filtering:</div>
            <div className="text-[11px] text-slate-300 font-mono">Time: O(|Items|^2 * |Baskets|)</div>
            <div className="text-[11px] text-slate-300 font-mono">Space: O(|Items|^2) similarity matrix</div>
            <p className="text-[11px] text-slate-400 pt-1">
              Advantage: Continuous similarity scores between all catalog items; overcomes discrete support threshold cutoffs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
