import React from 'react';
import { 
  Database, 
  Upload, 
  ShoppingCart, 
  FileText, 
  BookOpen, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { DatasetMetadata } from '../types';
import { PRESET_DATASETS } from '../services/datasets/datasetRegistry';

interface NavbarProps {
  currentMetadata: DatasetMetadata;
  selectedDatasetId: string;
  onSelectDataset: (id: string) => void;
  onOpenUpload: () => void;
  onOpenCart: () => void;
  cartItemCount: number;
  onExportReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMetadata,
  selectedDatasetId,
  onSelectDataset,
  onOpenUpload,
  onOpenCart,
  cartItemCount,
  onExportReport
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0d1527]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand / Project Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Enterprise Analytics
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                Co-Purchase & MBA Engine
              </span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              Market Basket Intelligence <span className="text-blue-400 font-normal text-xs px-1.5 py-0.2 bg-blue-900/40 rounded border border-blue-700/40">v2.4</span>
            </h1>
          </div>
        </div>

        {/* Center: Dataset Selector */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 rounded-lg p-1">
          <div className="flex items-center gap-1.5 px-2 text-slate-400 text-xs">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Dataset:</span>
          </div>
          <select
            value={selectedDatasetId}
            onChange={(e) => onSelectDataset(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs font-medium rounded px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer pr-7"
          >
            <option value="instacart-groceries">Instacart Grocery (1.2k Baskets)</option>
            <option value="uk-online-retail">UK Online Retail Giftware (1.1k)</option>
            <option value="bakery-cafe">Artisan Bakery & Cafe POS (950)</option>
            <option value="electronics-tech">Tech & Electronics Bundles (850)</option>
            <option value="fashion-apparel">Fashion & Streetwear (800)</option>
            {selectedDatasetId.startsWith('custom-upload') && (
              <option value={selectedDatasetId}>Custom Uploaded Dataset</option>
            )}
          </select>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 text-xs font-medium border border-blue-500/30 transition-colors"
            title="Upload any Kaggle or Custom Transaction CSV/Excel"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload CSV</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Export PDF Report */}
          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-95"
            title="Export Comprehensive Analytics Report as PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF Report</span>
            <span className="sm:hidden">PDF</span>
          </button>

          {/* Cart Simulator Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-medium border border-emerald-500/40 transition-all active:scale-95"
            title="Open Live Shopping Cart Simulator"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline font-semibold">Cart Simulator</span>
            {cartItemCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px]">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dataset selector row */}
      <div className="mt-2 pt-2 border-t border-slate-800/60 md:hidden flex items-center justify-between gap-2">
        <select
          value={selectedDatasetId}
          onChange={(e) => onSelectDataset(e.target.value)}
          className="flex-1 bg-slate-800 text-slate-200 text-xs rounded px-2.5 py-1 border border-slate-700"
        >
          <option value="instacart-groceries">Instacart Grocery (1.2k)</option>
          <option value="uk-online-retail">UK Online Retail (1.1k)</option>
          <option value="bakery-cafe">Artisan Bakery & Cafe (950)</option>
          <option value="electronics-tech">Tech & Electronics (850)</option>
          <option value="fashion-apparel">Fashion & Streetwear (800)</option>
        </select>
        <button
          onClick={onOpenUpload}
          className="px-2.5 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-1 font-medium"
        >
          <Upload className="w-3 h-3" />
          Upload
        </button>
      </div>
    </header>
  );
};
