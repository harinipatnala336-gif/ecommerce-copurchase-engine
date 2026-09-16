import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Sparkles, 
  Plus, 
  Minus, 
  Trash2, 
  Tag, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Flame, 
  DollarSign, 
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, AssociationRule, Recommendation, CartItem } from '../types';
import { getCartRecommendations, SimilarityMatrix } from '../services/marketBasketMining';

interface RecommendationSimulatorProps {
  products: Product[];
  rules: AssociationRule[];
  similarityMatrix: SimilarityMatrix | null;
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onClearCart: () => void;
  onLoadPresetBasket: (itemNames: string[]) => void;
}

export const RecommendationSimulator: React.FC<RecommendationSimulatorProps> = ({
  products,
  rules,
  similarityMatrix,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  onClearCart,
  onLoadPresetBasket
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [strategy, setStrategy] = useState<'hybrid' | 'association_rule' | 'collaborative_filtering' | 'frequent_itemset'>('hybrid');
  const [selectedExplainingRec, setSelectedExplainingRec] = useState<Recommendation | null>(null);
  const [checkedOut, setCheckedOut] = useState<boolean>(false);

  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  const filteredCatalog = useMemo(() => {
    return products.filter(p => {
      const matchesCat = activeCategory === 'ALL' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                            p.category.toLowerCase().includes(catalogSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, activeCategory, catalogSearch]);

  const cartItemNames = useMemo(() => {
    return cartItems.map(ci => ci.product.name);
  }, [cartItems]);

  // Compute live recommendations dynamically whenever cart or strategy changes
  const recommendations = useMemo(() => {
    return getCartRecommendations(
      cartItemNames,
      products,
      rules,
      similarityMatrix,
      strategy,
      6
    );
  }, [cartItemNames, products, rules, similarityMatrix, strategy]);

  // Calculate pricing & bundle discounts
  const { subtotal, discount, total } = useMemo(() => {
    const rawSubtotal = cartItems.reduce((sum, ci) => sum + (ci.product.price * ci.quantity), 0);
    // Apply 10% bundle discount if cart has 3 or more items
    const discountAmount = cartItems.length >= 3 ? rawSubtotal * 0.12 : 0;
    const finalTotal = Math.max(0, rawSubtotal - discountAmount);

    return {
      subtotal: Number(rawSubtotal.toFixed(2)),
      discount: Number(discountAmount.toFixed(2)),
      total: Number(finalTotal.toFixed(2))
    };
  }, [cartItems]);

  const handleCheckout = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
    setCheckedOut(true);
    setTimeout(() => setCheckedOut(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Live Shopping Cart & Co-Purchase Recommendation Engine
          </h2>
          <p className="text-xs text-slate-400">
            Simulates real-world shopper checkout behavior with dynamic multi-strategy recommendation scoring and instant basket completion.
          </p>
        </div>

        {/* Algorithm Strategy Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <span className="text-[11px] text-slate-400 px-2 font-medium">Strategy:</span>
          
          <button
            onClick={() => setStrategy('hybrid')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              strategy === 'hybrid'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Blends MBA Association Rules with Collaborative Filtering"
          >
            <Cpu className="w-3 h-3" />
            Hybrid Ensemble
          </button>

          <button
            onClick={() => setStrategy('association_rule')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              strategy === 'association_rule'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Pure Association Rule Mining (Lift & Confidence prioritized)"
          >
            <Flame className="w-3 h-3" />
            MBA Rules
          </button>

          <button
            onClick={() => setStrategy('collaborative_filtering')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              strategy === 'collaborative_filtering'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Item-Item Cosine Similarity Matrix"
          >
            <Layers className="w-3 h-3" />
            Item-Item CF
          </button>
        </div>
      </div>

      {/* Preset Basket Quick-Load Toolbar */}
      <div className="flex flex-wrap items-center gap-2 text-xs bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
        <span className="text-slate-400 font-medium flex items-center gap-1.5 pl-1">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Quick-Load Archetype Baskets:
        </span>

        {products.length > 3 && (
          <>
            <button
              onClick={() => onLoadPresetBasket([products[0].name, products[1]?.name || products[0].name])}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition-colors"
            >
              Basket A ({products[0].name.substring(0, 15)}...)
            </button>

            {products[2] && (
              <button
                onClick={() => onLoadPresetBasket([products[1].name, products[2].name])}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition-colors"
              >
                Basket B ({products[1].name.substring(0, 15)}...)
              </button>
            )}

            {products[4] && (
              <button
                onClick={() => onLoadPresetBasket([products[0].name, products[2].name, products[4].name])}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition-colors"
              >
                Trio Multi-Category Bundle
              </button>
            )}
          </>
        )}

        <button
          onClick={onClearCart}
          className="ml-auto text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 px-2 py-1"
        >
          <Trash2 className="w-3 h-3" />
          Clear Cart
        </button>
      </div>

      {/* Main 3-Column Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Store Product Catalog (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-4 space-y-4 flex flex-col justify-between max-h-[760px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Store Catalog ({filteredCatalog.length} SKUs)
              </h3>
              <input
                type="text"
                placeholder="Search catalog..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-36"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat === 'ALL' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Items Grid */}
          <div className="space-y-2 overflow-y-auto pr-1 flex-1 my-2">
            {filteredCatalog.map(product => {
              const inCart = cartItems.find(ci => ci.product.id === product.id);
              return (
                <div
                  key={product.id}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{product.icon || '📦'}</span>
                    <div>
                      <div className="text-xs font-bold text-white line-clamp-1">{product.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{product.category}</span>
                        <span className="font-mono text-slate-400">· Pop: {Math.round(product.support * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-white font-mono">${product.price.toFixed(2)}</span>
                    <button
                      onClick={() => onAddToCart(product)}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        inCart
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30'
                      }`}
                      title="Add item to shopping cart"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Active Shopping Cart (3 Cols) */}
        <div className="lg:col-span-3 glass-panel rounded-2xl p-4 flex flex-col justify-between max-h-[760px] border-emerald-500/30">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Current Cart ({cartItems.reduce((acc, c) => acc + c.quantity, 0)})
                </h3>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 overflow-y-auto max-h-80 pr-1">
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <div
                    key={item.product.id}
                    className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white line-clamp-1">{item.product.name}</span>
                      <span className="font-mono text-slate-300">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 font-mono">${item.product.price.toFixed(2)} each</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onRemoveFromCart(item.product.id)}
                          className="p-0.5 ml-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <ShoppingCart className="w-8 h-8 mx-auto text-slate-400/40" />
                  <p>Cart is currently empty.</p>
                  <p className="text-[11px] text-slate-400">Add SKUs from catalog to trigger real-time AI suggestions!</p>
                </div>
              )}
            </div>
          </div>

          {/* Checkout & Pricing summary */}
          <div className="pt-3 border-t border-slate-800 space-y-2.5">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Bundle Saving (12%):
                  </span>
                  <span className="font-mono">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-slate-800">
                <span>Total Amount:</span>
                <span className="font-mono text-emerald-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                cartItems.length > 0
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {checkedOut ? 'Order Placed Successfully!' : 'Simulate Checkout'}
            </button>
          </div>
        </div>

        {/* Column 3: Real-Time Recommendations Engine (4 Cols) */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-4 flex flex-col justify-between max-h-[760px] border-blue-500/30">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Real-Time AI Recommendations ({recommendations.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-blue-400 uppercase bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                {strategy}
              </span>
            </div>

            {/* Recommendations List */}
            <div className="space-y-3 overflow-y-auto max-h-[580px] pr-1">
              {recommendations.map((rec, idx) => (
                <div
                  key={rec.product.id}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{rec.product.icon || '✨'}</span>
                      <div>
                        <div className="text-xs font-bold text-white line-clamp-1">{rec.product.name}</div>
                        <div className="text-[10px] text-slate-400">{rec.product.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white font-mono">${rec.product.price.toFixed(2)}</div>
                      <span className="text-[10px] font-bold text-amber-400 font-mono">
                        {rec.lift > 1.0 ? `Lift: ${rec.lift.toFixed(1)}x` : 'Staple'}
                      </span>
                    </div>
                  </div>

                  {/* Affinity score bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Recommendation Score:</span>
                      <span className="text-emerald-400 font-bold">{Math.round(rec.score * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full"
                        style={{ width: `${Math.min(100, rec.score * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-tight">
                    {rec.reason}
                  </p>

                  <div className="pt-1.5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedExplainingRec(rec)}
                      className="text-[11px] text-slate-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
                    >
                      <HelpCircle className="w-3 h-3 text-blue-400" />
                      Explain Why
                    </button>

                    <button
                      onClick={() => onAddToCart(rec.product)}
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-blue-500/20 transition-all active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                      Add to Basket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mathematical Explainability Modal */}
      {selectedExplainingRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass-panel rounded-2xl p-6 border-blue-500/40 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Mathematical Explainability Audit
                </h3>
              </div>
              <button
                onClick={() => setSelectedExplainingRec(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Target Recommended SKU:</div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{selectedExplainingRec.product.icon}</span>
                <span>{selectedExplainingRec.product.name}</span>
                <span className="font-mono text-emerald-400 ml-auto">${selectedExplainingRec.product.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="font-semibold text-slate-200">How this score was calculated:</div>
              <div className="grid grid-cols-2 gap-2 text-slate-400 font-mono text-[11px]">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div>Confidence P(Rec | Cart):</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">
                    {Math.round(selectedExplainingRec.confidence * 100)}%
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div>Lift Multiplier:</div>
                  <div className="text-amber-400 font-bold text-sm mt-0.5">
                    {selectedExplainingRec.lift.toFixed(2)}x
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {selectedExplainingRec.reason}
              </p>
            </div>

            <button
              onClick={() => setSelectedExplainingRec(null)}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
