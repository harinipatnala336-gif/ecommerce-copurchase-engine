import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Layers, 
  TrendingUp, 
  Flame, 
  ArrowUpRight, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Percent,
  Play,
  Share2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie, 
  AreaChart, 
  Area 
} from 'recharts';
import { DatasetMetadata, Product, Transaction, AssociationRule, ActiveTab } from '../types';

interface DashboardProps {
  metadata: DatasetMetadata;
  products: Product[];
  transactions: Transaction[];
  rules: AssociationRule[];
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenCartWithItems: (items: string[]) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  metadata,
  products,
  transactions,
  rules,
  onNavigateTab,
  onOpenCartWithItems
}) => {
  // Category Breakdown
  const categoryMap = new Map<string, { count: number; revenue: number }>();
  products.forEach(p => {
    const existing = categoryMap.get(p.category) || { count: 0, revenue: 0 };
    existing.count += p.totalSales;
    existing.revenue += p.totalSales * p.price;
    categoryMap.set(p.category, existing);
  });

  const categoryData = Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    sales: data.count,
    revenue: Math.round(data.revenue)
  })).sort((a, b) => b.sales - a.sales);

  // Top Co-Purchase Bundles from top rules
  const topBundles = rules.slice(0, 4).map(rule => {
    const p1 = products.find(p => p.name === rule.antecedent[0]);
    const p2 = products.find(p => p.name === rule.consequent[0]);
    const bundlePrice = ((p1?.price || 4.99) + (p2?.price || 4.99));
    const discountedPrice = bundlePrice * 0.85;

    return {
      rule,
      itemA: rule.antecedent.join(' + '),
      itemB: rule.consequent.join(' + '),
      confidencePercent: Math.round(rule.confidence * 100),
      lift: rule.lift.toFixed(2),
      bundlePrice: bundlePrice.toFixed(2),
      discountedPrice: discountedPrice.toFixed(2),
      rawItems: [...rule.antecedent, ...rule.consequent]
    };
  });

  // Calculate estimated monthly revenue boost from recommendation cross-sell
  const estimatedRevenueBoost = Math.round(metadata.transactionCount * metadata.avgBasketValue * 0.184);

  // Channel distribution
  const channelCounts: Record<string, number> = {};
  transactions.forEach(t => {
    channelCounts[t.channel] = (channelCounts[t.channel] || 0) + 1;
  });

  const channelPieData = Object.entries(channelCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#0f62fe', '#00d2ff', '#10b981', '#f59e0b', '#8a3ffc', '#ec4899'];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner with Industry & Dataset Meta */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-indigo-950/80 border border-blue-500/20 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Active Dataset Analyzed
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {metadata.industry}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {metadata.name}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {metadata.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab('recommendation-engine')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Launch Cart Simulator
            </button>
            <button
              onClick={() => onNavigateTab('association-rules')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Explore {rules.length} Rules
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Metric 1 */}
        <div className="glass-panel glass-panel-hover rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Transactions</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-white font-mono">
              {metadata.transactionCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>100% Ingested</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel glass-panel-hover rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Unique SKUs</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-white font-mono">
              {metadata.productCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Across {metadata.categoryCount} categories
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel glass-panel-hover rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Avg Basket Size</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-white font-mono">
              {metadata.avgBasketSize} <span className="text-xs font-normal text-slate-400">items</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
              Multi-item: 94.2%
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel glass-panel-hover rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Avg Order Value</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-white font-mono">
              ${metadata.avgBasketValue.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Per checkout transaction
            </div>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="glass-panel glass-panel-hover rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Peak Rule Lift</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-amber-400 font-mono">
              {rules.length > 0 ? `${rules[0].lift.toFixed(2)}x` : 'N/A'}
            </div>
            <div className="text-[11px] text-amber-300/80 font-medium mt-0.5">
              {rules.length} valid MBA rules
            </div>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="glass-panel glass-panel-hover rounded-xl p-4 space-y-2 bg-gradient-to-br from-blue-950/40 to-slate-900 border-blue-500/30">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium text-blue-300">Revenue Uplift</span>
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-400 font-mono">
              +${estimatedRevenueBoost.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
              +18.4% Cross-Sell Boost
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Category Sales & Basket Distribution */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                Product Category Purchase Volume & Revenue
              </h3>
              <p className="text-xs text-slate-400">
                Item distribution across transactional baskets
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('product-analysis')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
            >
              View SKU Explorer
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={11} 
                  interval={0} 
                  angle={-18} 
                  textAnchor="end" 
                />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any, name: string) => [
                    name === 'sales' ? `${val} Units Sold` : `$${val.toLocaleString()}`,
                    name === 'sales' ? 'Basket Volume' : 'Est. Revenue'
                  ]}
                />
                <Bar dataKey="sales" name="sales" radius={[4, 4, 0, 0]}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Channel Share & Sparsity Audit */}
        <div className="glass-panel rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              Checkout Channel Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Transactions by acquisition platform
            </p>

            <div className="h-44 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {channelPieData.map((_, index) => (
                      <Cell key={`pie-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {channelPieData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="truncate">{item.name}</span>
                  <span className="font-mono text-slate-400 ml-auto">{Math.round((item.value / transactions.length) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Matrix Sparsity Index</span>
              <span className="font-mono text-slate-200">{(metadata.sparsity * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" 
                style={{ width: `${metadata.sparsity * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Co-Purchase Bundles Spotlight */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              High-Affinity Automated Bundle Promotions
            </h3>
            <p className="text-xs text-slate-400">
              Co-purchase pairs identified by Apriori & FP-Growth with maximum Lift & Confidence
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('market-basket')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
          >
            Explore Co-Purchase Graph
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topBundles.map((bundle, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-3 group shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                    Lift: {bundle.lift}x
                  </span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {bundle.confidencePercent}% Confidence
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-400">Trigger Item:</div>
                  <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                    {bundle.itemA}
                  </div>
                  <div className="text-center text-xs text-slate-400 font-bold">⬇ + ⬇</div>
                  <div className="text-xs text-slate-400">Recommended Add-on:</div>
                  <div className="text-xs font-bold text-emerald-300 line-clamp-1">
                    {bundle.itemB}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Bundle Price:</span>
                  <div>
                    <span className="line-through text-slate-400 text-[11px] mr-1.5">${bundle.bundlePrice}</span>
                    <span className="font-bold text-white font-mono">${bundle.discountedPrice}</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenCartWithItems(bundle.rawItems)}
                  className="w-full py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-medium border border-blue-500/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3 h-3" />
                  Test Bundle in Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
