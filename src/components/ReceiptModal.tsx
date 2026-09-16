import React from 'react';
import { ShoppingBag, Receipt, Calendar, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { Transaction, Product, AssociationRule } from '../types';

interface ReceiptModalProps {
  transaction: Transaction | null;
  products: Product[];
  rules: AssociationRule[];
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  products,
  rules,
  onClose
}) => {
  if (!transaction) return null;

  // Identify if any association rule was triggered within this transaction basket
  const detectedRules = rules.filter(r => 
    r.antecedent.every(item => transaction.items.includes(item)) &&
    r.consequent.every(item => transaction.items.includes(item))
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md glass-panel rounded-2xl p-6 border-slate-700 space-y-4 shadow-2xl relative bg-[#0c1220]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Digital Checkout Receipt
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Receipt Header details */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs text-slate-300 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Order ID:</span>
            <span className="text-white font-bold">{transaction.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Customer:</span>
            <span className="text-blue-400">{transaction.customerId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Timestamp:</span>
            <span>{new Date(transaction.timestamp).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Payment:</span>
            <span>{transaction.paymentMethod} ({transaction.channel})</span>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Purchased Basket Items ({transaction.itemCount})
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {transaction.items.map((itemName, idx) => {
              const prod = products.find(p => p.name === itemName);
              const price = prod ? prod.price : 4.50;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span>{prod?.icon || '📦'}</span>
                    <span className="text-slate-200 line-clamp-1">{itemName}</span>
                  </div>
                  <span className="font-mono text-slate-300 font-bold">${price.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total calculation */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm">
          <span className="text-slate-400 font-semibold">Total Amount Paid:</span>
          <span className="text-emerald-400 font-bold font-mono text-base">${transaction.totalAmount.toFixed(2)}</span>
        </div>

        {/* MBA Pattern Recognition Tag */}
        {detectedRules.length > 0 && (
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Detected MBA Co-Purchase Pattern:</span>
            </div>
            <p className="text-[11px] text-slate-300">
              This basket successfully paired <strong className="text-white">{detectedRules[0].antecedent.join(' & ')}</strong> with <strong className="text-emerald-300">{detectedRules[0].consequent.join(' & ')}</strong> (Lift: {detectedRules[0].lift.toFixed(2)}x).
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all"
        >
          Close Receipt
        </button>
      </div>
    </div>
  );
};
