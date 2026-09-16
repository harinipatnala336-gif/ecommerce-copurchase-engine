import React from 'react';
import { 
  LayoutDashboard, 
  PackageSearch, 
  Network, 
  GitBranch, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  Activity, 
  Award,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  rulesCount: number;
  transactionsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  rulesCount,
  transactionsCount
}) => {
  const menuItems: { id: ActiveTab; label: string; icon: React.FC<any>; badge?: string | number; color: string }[] = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-400'
    },
    {
      id: 'product-analysis',
      label: 'Product Analysis',
      icon: PackageSearch,
      color: 'text-cyan-400'
    },
    {
      id: 'market-basket',
      label: 'Market Basket & Graphs',
      icon: Network,
      color: 'text-emerald-400',
      badge: 'Visual 2D/3D'
    },
    {
      id: 'association-rules',
      label: 'Association Rules Miner',
      icon: GitBranch,
      color: 'text-indigo-400',
      badge: rulesCount > 0 ? rulesCount : undefined
    },
    {
      id: 'recommendation-engine',
      label: 'Live Recommendation Engine',
      icon: Sparkles,
      color: 'text-amber-400',
      badge: 'Interactive'
    },
    {
      id: 'transaction-insights',
      label: 'Transaction Insights & RFM',
      icon: TrendingUp,
      color: 'text-pink-400'
    },
    {
      id: 'transaction-records',
      label: 'Transaction Data Explorer',
      icon: Layers,
      color: 'text-teal-400',
      badge: transactionsCount > 0 ? `${transactionsCount}` : undefined
    },
    {
      id: 'model-performance',
      label: 'Model Performance Benchmark',
      icon: Activity,
      color: 'text-rose-400'
    }
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-[#0a0f1d]/95 border-r border-slate-800/80 p-3 lg:p-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Core Project Modules
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-300 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-400' : item.color}`} />
                  <span className={isActive ? 'font-semibold text-white' : ''}>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                      isActive 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status badge */}
      <div className="mt-6 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1.5 hidden lg:block">
        <div className="flex items-center justify-between text-slate-300">
          <span className="font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Engine Active
          </span>
          <span className="text-[10px] font-mono text-emerald-400">Apriori + FP-Tree</span>
        </div>
        <p className="text-[10px] text-slate-400">
          Real-time in-browser itemset lattice generation & live cart recommendation pipeline.
        </p>
      </div>
    </aside>
  );
};
