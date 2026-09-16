import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Package, 
  TrendingUp, 
  Layers, 
  Percent, 
  ShoppingBag, 
  Sparkles, 
  ArrowUpRight,
  Zap,
  BarChart2,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  Cell 
} from 'recharts';
import { Product, Transaction, AssociationRule } from '../types';

interface ProductAnalysisProps {
  products: Product[];
  transactions: Transaction[];
  rules: AssociationRule[];
  onSelectProductForCart: (product: Product) => void;
}

export const ProductAnalysis: React.FC<ProductAnalysisProps> = ({
  products,
  transactions,
  rules,
  onSelectProductForCart
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [sortBy, setSortBy] = useState<'sales' | 'support' | 'price' | 'velocity'>('sales');

  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        if (sortBy === 'sales') return b.totalSales - a.totalSales;
        if (sortBy === 'support') return b.support - a.support;
        if (sortBy === 'price') return b.price - a.price;
        return b.itemVelocity - a.itemVelocity;
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

  const activeProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || products[0] || null;
  }, [products, selectedProductId]);

  // Calculate top co-purchased companion items for the active product
  const companionAffinity = useMemo(() => {
    if (!activeProduct) return [];

    const coCounts = new Map<string, number>();
    let totalTargetBaskets = 0;

    transactions.forEach(t => {
      if (t.items.includes(activeProduct.name)) {
        totalTargetBaskets++;
        t.items.forEach(item => {
          if (item !== activeProduct.name) {
            coCounts.set(item, (coCounts.get(item) || 0) + 1);
          }
        });
      }
    });

    return Array.from(coCounts.entries())
      .map(([name, count]) => {
        const otherProduct = products.find(p => p.name === name);
        const affinityPercent = totalTargetBaskets > 0 ? Math.round((count / totalTargetBaskets) * 100) : 0;
        return {
          name,
          count,
          affinityPercent,
          price: otherProduct?.price || 4.50,
          category: otherProduct?.category || 'General'
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [activeProduct, transactions, products]);

  // Association rules involving this product
  const relatedRules = useMemo(() => {
    if (!activeProduct) return [];
    return rules.filter(r => 
      r.antecedent.includes(activeProduct.name) || r.consequent.includes(activeProduct.name)
    ).slice(0, 5);
  }, [activeProduct, rules]);

  // Scatter data: Support vs Price / Velocity
  const scatterData = useMemo(() => {
    return products.map(p => ({
      name: p.name,
      support: Number((p.support * 100).toFixed(1)),
      velocity: p.itemVelocity,
      price: p.price,
      category: p.category,
      sales: p.totalSales
    }));
  }, [products]);

  const COLORS = ['#0f62fe', '#00d2ff', '#10b981', '#f59e0b', '#8a3ffc', '#ec4899'];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            Product SKU Analysis & Co-Purchase Affinity Explorer
          </h2>
          <p className="text-xs text-slate-400">
            Inspect individual item velocity, market basket penetration rate, and frequent companion pairings.
          </p>
        </div>

        {/* Search and Category Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search SKU or Category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-52"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="sales">Sort: Units Sold</option>
            <option value="support">Sort: Support %</option>
            <option value="price">Sort: Price</option>
            <option value="velocity">Sort: Velocity</option>
          </select>
        </div>
      </div>

      {/* Main Grid: SKU List (Left) + Detailed Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: SKU Directory Cards */}
        <div className="lg:col-span-5 space-y-3 max-h-[780px] overflow-y-auto pr-1">
          {filteredProducts.map(prod => {
            const isSelected = activeProduct?.id === prod.id;
            return (
              <div
                key={prod.id}
                onClick={() => setSelectedProductId(prod.id)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10'
                    : 'glass-panel hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{prod.icon || '📦'}</span>
                    <div>
                      <div className="text-xs font-bold text-white line-clamp-1">{prod.name}</div>
                      <div className="text-[11px] text-slate-400">{prod.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-white font-mono">${prod.price.toFixed(2)}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">{(prod.support * 100).toFixed(1)}% Support</div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Sales: <strong className="text-slate-200 font-mono">{prod.totalSales}</strong> txs</span>
                  <span>Velocity: <strong className="text-amber-300 font-mono">{prod.itemVelocity}/100</strong></span>
                  <span>Margin: <strong className="text-cyan-300 font-mono">{Math.round(prod.marginRate * 100)}%</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep-Dive Inspector */}
        {activeProduct && (
          <div className="lg:col-span-7 space-y-5">
            
            {/* Active Product Headline Card */}
            <div className="glass-panel rounded-2xl p-5 border-blue-500/30 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-500/40 flex items-center justify-center text-3xl shadow-inner">
                    {activeProduct.icon || '📦'}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {activeProduct.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {activeProduct.name}
                    </h3>
                    <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                      <span>Unit Price: <strong className="text-white font-mono">${activeProduct.price.toFixed(2)}</strong></span>
                      <span>Catalog ID: <span className="font-mono text-slate-400">{activeProduct.id}</span></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectProductForCart(activeProduct)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 self-start sm:self-auto"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Add to Cart Simulator
                </button>
              </div>

              {/* 4 Micro Metric Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-medium">Basket Penetration</div>
                  <div className="text-base font-bold text-blue-400 font-mono mt-0.5">
                    {(activeProduct.support * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-medium">Total Baskets</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">
                    {activeProduct.totalSales}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-medium">Velocity Score</div>
                  <div className="text-base font-bold text-amber-400 font-mono mt-0.5">
                    {activeProduct.itemVelocity} <span className="text-xs text-slate-400">/100</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-medium">Gross Margin</div>
                  <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                    {Math.round(activeProduct.marginRate * 100)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Top Companion Products Chart */}
            <div className="glass-panel rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Top Co-Purchased Items with "{activeProduct.name}"
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Calculated percentage of times customers bought companion items when this product was in their basket.
                  </p>
                </div>
              </div>

              {companionAffinity.length > 0 ? (
                <div className="h-52 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={companionAffinity} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                      <XAxis type="number" unit="%" stroke="#64748b" fontSize={11} />
                      <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} width={120} tickFormatter={(v) => v.length > 18 ? `${v.substring(0, 16)}...` : v} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                        formatter={(val: any) => [`${val}% Basket Affinity (${companionAffinity.find(c => c.affinityPercent === val)?.count} times)`, 'Co-Occurrence']}
                      />
                      <Bar dataKey="affinityPercent" fill="#0f62fe" radius={[0, 4, 4, 0]}>
                        {companionAffinity.map((_, index) => (
                          <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No co-occurrence data found for this item in current baskets.
                </div>
              )}
            </div>

            {/* Association Rules Involving this Product */}
            <div className="glass-panel rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                Active MBA Association Rules Triggered
              </h4>

              {relatedRules.length > 0 ? (
                <div className="space-y-2">
                  {relatedRules.map((rule, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-blue-400">
                          {rule.antecedent.join(' + ')} ➔ {rule.consequent.join(' + ')}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 font-bold font-mono">
                            Lift: {rule.lift.toFixed(2)}x
                          </span>
                          <span className="text-emerald-400 font-semibold font-mono">
                            {Math.round(rule.confidence * 100)}% Conf
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {rule.naturalLanguage}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">
                  No high-confidence association rules generated for this item at current threshold.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Catalog Penetration & Velocity Scatter Matrix */}
      <div className="glass-panel rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              Catalog Matrix: Basket Support vs Item Velocity
            </h3>
            <p className="text-xs text-slate-400">
              Visualizes high-frequency core staples (top-right) vs niche high-affinity bundle drivers (top-left).
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
              <XAxis type="number" dataKey="support" name="Support" unit="%" stroke="#64748b" fontSize={11} />
              <YAxis type="number" dataKey="velocity" name="Velocity Score" stroke="#64748b" fontSize={11} domain={[40, 100]} />
              <ZAxis type="number" dataKey="sales" range={[40, 300]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                formatter={(val: any, name: string) => [val, name]}
              />
              <Scatter name="SKUs" data={scatterData} fill="#0f62fe">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
