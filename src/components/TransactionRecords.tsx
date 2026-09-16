import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Receipt, 
  ShieldAlert, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Upload,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { Transaction, Product, AssociationRule, AnomalyRecord } from '../types';

interface TransactionRecordsProps {
  transactions: Transaction[];
  products: Product[];
  rules: AssociationRule[];
  onOpenReceipt: (tx: Transaction) => void;
  onOpenUpload: () => void;
}

export const TransactionRecords: React.FC<TransactionRecordsProps> = ({
  transactions,
  products,
  rules,
  onOpenReceipt,
  onOpenUpload
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'anomalies'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortField, setSortField] = useState<'id' | 'items' | 'amount' | 'time'>('time');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesChannel = channelFilter === 'ALL' || t.channel === channelFilter;
        const matchesSearch = !searchQuery ||
          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesChannel && matchesSearch;
      })
      .sort((a, b) => {
        let res = 0;
        if (sortField === 'id') res = a.id.localeCompare(b.id);
        else if (sortField === 'items') res = a.itemCount - b.itemCount;
        else if (sortField === 'amount') res = a.totalAmount - b.totalAmount;
        else res = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();

        return sortAsc ? res : -res;
      });
  }, [transactions, searchQuery, channelFilter, sortField, sortAsc]);

  // Compute anomaly records
  const anomalies: AnomalyRecord[] = useMemo(() => {
    const records: AnomalyRecord[] = [];
    const avgBasket = transactions.reduce((acc, t) => acc + t.itemCount, 0) / (transactions.length || 1);
    const avgVal = transactions.reduce((acc, t) => acc + t.totalAmount, 0) / (transactions.length || 1);

    transactions.forEach(t => {
      if (t.itemCount >= avgBasket * 1.8) {
        records.push({
          transactionId: t.id,
          items: t.items,
          itemCount: t.itemCount,
          totalAmount: t.totalAmount,
          anomalyType: 'Extremely Large Basket',
          severity: 'high',
          explanation: `Basket contains ${t.itemCount} items, significantly above dataset mean of ${avgBasket.toFixed(1)} items.`
        });
      } else if (t.totalAmount >= avgVal * 2.2) {
        records.push({
          transactionId: t.id,
          items: t.items,
          itemCount: t.itemCount,
          totalAmount: t.totalAmount,
          anomalyType: 'High-Value Outlier',
          severity: 'medium',
          explanation: `Checkout value of $${t.totalAmount.toFixed(2)} exceeds 220% of typical order average.`
        });
      }
    });

    return records.slice(0, 30);
  }, [transactions]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSort = (field: 'id' | 'items' | 'amount' | 'time') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-400" />
            Transaction Data Explorer & Outlier Diagnostics
          </h2>
          <p className="text-xs text-slate-400">
            Query individual basket logs, audit receipt items, and isolate bulk purchase outliers.
          </p>
        </div>

        {/* Tab & Upload Buttons */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              All Transactions ({transactions.length})
            </button>

            <button
              onClick={() => setActiveTab('anomalies')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'anomalies'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Outlier Anomalies ({anomalies.length})
            </button>
          </div>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold border border-blue-500/30 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Ingest Custom CSV
          </button>
        </div>
      </div>

      {activeTab === 'all' ? (
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer ID, or item name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={channelFilter}
                onChange={(e) => {
                  setChannelFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ALL">All Channels</option>
                <option value="Web">Web</option>
                <option value="Mobile App">Mobile App</option>
                <option value="In-Store">In-Store</option>
              </select>

              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value={15}>15 per page</option>
                <option value={30}>30 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>

          {/* Paginated Transactions Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th 
                    onClick={() => toggleSort('id')}
                    className="px-4 py-3 cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>Order ID</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3">Customer</th>
                  <th 
                    onClick={() => toggleSort('time')}
                    className="px-4 py-3 cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>Timestamp</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3">Basket Items</th>
                  <th 
                    onClick={() => toggleSort('items')}
                    className="px-4 py-3 cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>Count</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => toggleSort('amount')}
                    className="px-4 py-3 cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>Total Value</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {paginatedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-blue-400 font-bold">{tx.id}</td>
                    <td className="px-4 py-3 text-slate-300 font-sans">{tx.customerId}</td>
                    <td className="px-4 py-3 text-slate-400 text-[11px] font-sans">
                      {new Date(tx.timestamp).toLocaleDateString()} {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 font-sans max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {tx.items.slice(0, 3).map((item, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700 truncate max-w-[120px]">
                            {item}
                          </span>
                        ))}
                        {tx.items.length > 3 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{tx.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-200 font-bold">{tx.itemCount}</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">${tx.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3 font-sans">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                        {tx.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      <button
                        onClick={() => onOpenReceipt(tx)}
                        className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-xs font-semibold flex items-center gap-1 ml-auto transition-colors"
                      >
                        <Receipt className="w-3 h-3" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
            <span>
              Showing {filteredTransactions.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredTransactions.length)} of {filteredTransactions.length} records
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-200">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Outlier Anomalies Grid */
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Detected Basket Outliers & Data Anomalies
              </h3>
              <p className="text-xs text-slate-400">
                Identified transactions with statistical variance exceeding 2 standard deviations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anomalies.map((anom, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/30 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold font-mono">
                    {anom.transactionId}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    {anom.anomalyType}
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  {anom.explanation}
                </p>

                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Items ({anom.itemCount}):</span>
                  <span className="text-emerald-400 font-bold">${anom.totalAmount.toFixed(2)}</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {anom.items.map((item, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
