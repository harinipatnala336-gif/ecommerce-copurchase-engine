import React, { useState, useMemo } from 'react';
import { 
  GitBranch, 
  Sliders, 
  Search, 
  Download, 
  FileCode, 
  FileSpreadsheet, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  Eye,
  Copy,
  Check
} from 'lucide-react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { AssociationRule, Product } from '../types';

interface AssociationRulesProps {
  rules: AssociationRule[];
  minSupport: number;
  minConfidence: number;
  minLift: number;
  onMinSupportChange: (val: number) => void;
  onMinConfidenceChange: (val: number) => void;
  onMinLiftChange: (val: number) => void;
  onSelectProductForCart: (product: Product) => void;
  products: Product[];
}

export const AssociationRules: React.FC<AssociationRulesProps> = ({
  rules,
  minSupport,
  minConfidence,
  minLift,
  onMinSupportChange,
  onMinConfidenceChange,
  onMinLiftChange,
  onSelectProductForCart,
  products
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'lift' | 'confidence' | 'support' | 'conviction'>('lift');
  const [selectedRule, setSelectedRule] = useState<AssociationRule | null>(rules[0] || null);
  const [copiedSQL, setCopiedSQL] = useState(false);

  const filteredRules = useMemo(() => {
    return rules
      .filter(rule => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          rule.antecedent.some(a => a.toLowerCase().includes(q)) ||
          rule.consequent.some(c => c.toLowerCase().includes(q)) ||
          rule.naturalLanguage.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'lift') return b.lift - a.lift;
        if (sortBy === 'confidence') return b.confidence - a.confidence;
        if (sortBy === 'support') return b.support - a.support;
        return b.conviction - a.conviction;
      });
  }, [rules, searchQuery, sortBy]);

  // Scatter plot data: Support vs Confidence sized by Lift
  const scatterData = useMemo(() => {
    return rules.slice(0, 100).map((r, i) => ({
      id: r.id,
      name: `${r.antecedent.join('+')} ➔ ${r.consequent.join('+')}`,
      support: Number((r.support * 100).toFixed(2)),
      confidence: Number((r.confidence * 100).toFixed(1)),
      lift: r.lift,
      rule: r
    }));
  }, [rules]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Antecedent', 'Consequent', 'Support', 'Confidence', 'Lift', 'Leverage', 'Conviction', 'Zhang'];
    const rows = filteredRules.map(r => [
      `"${r.antecedent.join(' & ')}"`,
      `"${r.consequent.join(' & ')}"`,
      r.support,
      r.confidence,
      r.lift,
      r.leverage,
      r.conviction,
      r.zhang
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `association_rules_minSup_${minSupport}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportToJSON = () => {
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredRules, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `association_rules.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy SQL Queries
  const copySQLInsert = () => {
    const sqlStatements = filteredRules.slice(0, 20).map(r => 
      `INSERT INTO mba_association_rules (antecedent, consequent, support, confidence, lift, leverage, conviction) VALUES ('${r.antecedent.join(', ')}', '${r.consequent.join(', ')}', ${r.support}, ${r.confidence}, ${r.lift}, ${r.leverage}, ${r.conviction});`
    ).join('\n');

    navigator.clipboard.writeText(sqlStatements);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-400" />
            Association Rules Mining & NLP Business Translation
          </h2>
          <p className="text-xs text-slate-400">
            Tune metric thresholds to generate actionable cross-sell rules with Support, Confidence, Lift, Leverage, and Conviction.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            Export CSV
          </button>

          <button
            onClick={exportToJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            Export JSON
          </button>

          <button
            onClick={copySQLInsert}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
          >
            {copiedSQL ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            {copiedSQL ? 'SQL Copied!' : 'Copy SQL'}
          </button>
        </div>
      </div>

      {/* Control Panel: Dynamic Threshold Tuning */}
      <div className="glass-panel rounded-2xl p-5 border-indigo-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            Algorithm Metric Threshold Tuning (Live Re-Mining)
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {filteredRules.length} Active Rules Generated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Min Support Slider */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Minimum Support P(A ∩ B)</span>
              <span className="font-mono text-blue-400 font-bold">{(minSupport * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.25"
              step="0.01"
              value={minSupport}
              onChange={(e) => onMinSupportChange(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>0.01 (Dense)</span>
              <span>0.25 (Strict)</span>
            </div>
          </div>

          {/* Min Confidence Slider */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Minimum Confidence P(B|A)</span>
              <span className="font-mono text-emerald-400 font-bold">{Math.round(minConfidence * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={minConfidence}
              onChange={(e) => onMinConfidenceChange(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>10% (Exploratory)</span>
              <span>90% (Deterministic)</span>
            </div>
          </div>

          {/* Min Lift Slider */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Minimum Lift (Multiplier)</span>
              <span className="font-mono text-amber-400 font-bold">{minLift.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.1"
              value={minLift}
              onChange={(e) => onMinLiftChange(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>1.0x (Baseline)</span>
              <span>6.0x (Strong Correlation)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scatter Plot Matrix: Support vs Confidence (Bubble = Lift) */}
      <div className="glass-panel rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Rule Distribution Matrix: Support vs Confidence vs Lift
            </h3>
            <p className="text-xs text-slate-400">
              High-value actionable rules cluster in the upper-right quadrant with largest bubble diameters (maximum Lift).
            </p>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
              <XAxis type="number" dataKey="support" name="Support" unit="%" stroke="#64748b" fontSize={11} />
              <YAxis type="number" dataKey="confidence" name="Confidence" unit="%" stroke="#64748b" fontSize={11} domain={[0, 100]} />
              <ZAxis type="number" dataKey="lift" range={[40, 280]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                formatter={(val: any, name: string) => [val, name]}
              />
              <Scatter name="Rules" data={scatterData} fill="#0f62fe">
                {scatterData.map((entry, index) => (
                  <Cell 
                    key={`rule-cell-${index}`} 
                    fill={entry.lift > 3.0 ? '#f59e0b' : (entry.lift > 2.0 ? '#10b981' : '#38bdf8')} 
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected Rule NLP Business Translation Spotlight */}
      {selectedRule && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                Rule ID: {selectedRule.id}
              </span>
              <span className="text-slate-400">Natural Language Business Translation</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              "{selectedRule.naturalLanguage}"
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-300 pt-1">
              <span>Support: <strong className="text-blue-400">{(selectedRule.support * 100).toFixed(1)}%</strong></span>
              <span>Confidence: <strong className="text-emerald-400">{Math.round(selectedRule.confidence * 100)}%</strong></span>
              <span>Lift: <strong className="text-amber-400">{selectedRule.lift.toFixed(2)}x</strong></span>
              <span>Leverage: <strong className="text-purple-400">{selectedRule.leverage.toFixed(4)}</strong></span>
              <span>Conviction: <strong className="text-pink-400">{selectedRule.conviction.toFixed(2)}</strong></span>
            </div>
          </div>

          <button
            onClick={() => {
              const p = products.find(prod => prod.name === selectedRule.antecedent[0]);
              if (p) onSelectProductForCart(p);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Test Antecedent in Cart
          </button>
        </div>
      )}

      {/* Rules Data Grid Table */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Antecedent (e.g. Milk) or Consequent (e.g. Bread)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="lift">Lift (Impact Multiplier)</option>
              <option value="confidence">Confidence %</option>
              <option value="support">Support %</option>
              <option value="conviction">Conviction</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Antecedent {`{A}`}</th>
                <th className="px-4 py-3">➔</th>
                <th className="px-4 py-3">Consequent {`{B}`}</th>
                <th className="px-4 py-3">Support</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Lift</th>
                <th className="px-4 py-3">Conviction</th>
                <th className="px-4 py-3">Leverage</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRules.slice(0, 100).map((rule, idx) => {
                const isSelected = selectedRule?.id === rule.id;
                return (
                  <tr
                    key={rule.id}
                    onClick={() => setSelectedRule(rule)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-600/15' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-sans font-medium text-white">
                      <span className="px-2 py-0.5 rounded bg-blue-900/30 text-blue-300 border border-blue-700/40">
                        {rule.antecedent.join(', ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-bold">➔</td>
                    <td className="px-4 py-3 font-sans font-medium text-emerald-300">
                      <span className="px-2 py-0.5 rounded bg-emerald-900/30 text-emerald-300 border border-emerald-700/40">
                        {rule.consequent.join(', ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{(rule.support * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-slate-200 font-bold">{Math.round(rule.confidence * 100)}%</td>
                    <td className="px-4 py-3 text-amber-400 font-bold">{rule.lift.toFixed(2)}x</td>
                    <td className="px-4 py-3 text-slate-400">{rule.conviction.toFixed(1)}</td>
                    <td className="px-4 py-3 text-slate-400">{rule.leverage.toFixed(3)}</td>
                    <td className="px-4 py-3 font-sans">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRule(rule);
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
