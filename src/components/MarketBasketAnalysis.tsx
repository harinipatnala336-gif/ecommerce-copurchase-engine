import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Network, 
  Layers, 
  Grid, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sliders, 
  Search, 
  Sparkles, 
  ArrowRight,
  Info,
  Maximize2
} from 'lucide-react';
import { Product, Transaction, Itemset, AssociationRule } from '../types';

interface MarketBasketAnalysisProps {
  products: Product[];
  transactions: Transaction[];
  itemsets: Itemset[];
  rules: AssociationRule[];
  minSupport: number;
  onMinSupportChange: (val: number) => void;
  onSelectProductForCart: (product: Product) => void;
}

interface NetworkNode {
  id: string;
  name: string;
  category: string;
  support: number;
  sales: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface NetworkEdge {
  source: string;
  target: string;
  lift: number;
  confidence: number;
}

export const MarketBasketAnalysis: React.FC<MarketBasketAnalysisProps> = ({
  products,
  transactions,
  itemsets,
  rules,
  minSupport,
  onMinSupportChange,
  onSelectProductForCart
}) => {
  const [activeTab, setActiveTab] = useState<'network' | 'itemsets' | 'category-matrix'>('network');
  const [minLiftFilter, setMinLiftFilter] = useState<number>(1.5);
  const [itemsetLengthFilter, setItemsetLengthFilter] = useState<number>(0); // 0 = all
  const [itemsetSearch, setItemsetSearch] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodesRef = useRef<NetworkNode[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const categoryColors: Record<string, string> = {
    'Produce': '#10b981',
    'Dairy & Eggs': '#38bdf8',
    'Bakery': '#f59e0b',
    'Pantry': '#8b5cf6',
    'Beverages': '#ec4899',
    'Snacks': '#f97316',
    'Meat & Seafood': '#ef4444',
    'Kitchen & Dining': '#3b82f6',
    'Home Decor': '#a855f7',
    'Bags & Storage': '#14b8a6',
    'Stationery & Craft': '#eab308',
    'Candles': '#f43f5e',
    'Coffee & Espresso': '#78350f',
    'Pastries': '#d97706',
    'Breads': '#b45309',
    'Savory': '#059669',
    'Desserts': '#db2777',
    'Computing': '#2563eb',
    'Peripherals': '#6366f1',
    'Accessories': '#06b6d4',
    'Audio': '#8b5cf6',
    'Displays': '#0284c7',
    'Tops': '#0284c7',
    'Outerwear': '#4f46e5',
    'Bottoms': '#059669',
    'Footwear': '#d97706'
  };

  const getCatColor = (cat: string) => categoryColors[cat] || '#38bdf8';

  // Build Network Graph nodes and edges from top rules
  const { nodes, edges } = useMemo(() => {
    const edgeList: NetworkEdge[] = [];
    const nodeMap = new Map<string, NetworkNode>();

    // Filter rules by minimum lift
    const filteredRules = rules.filter(r => r.lift >= minLiftFilter);

    filteredRules.forEach(rule => {
      if (rule.antecedent.length === 1 && rule.consequent.length === 1) {
        const src = rule.antecedent[0];
        const tgt = rule.consequent[0];
        edgeList.push({
          source: src,
          target: tgt,
          lift: rule.lift,
          confidence: rule.confidence
        });

        [src, tgt].forEach(name => {
          if (!nodeMap.has(name)) {
            const p = products.find(prod => prod.name === name);
            const cat = p?.category || 'General';
            const sup = p?.support || 0.15;
            const sales = p?.totalSales || 100;
            nodeMap.set(name, {
              id: name,
              name,
              category: cat,
              support: sup,
              sales,
              x: 0,
              y: 0,
              vx: 0,
              vy: 0,
              radius: Math.max(16, Math.min(32, Math.round(sup * 70))),
              color: getCatColor(cat)
            });
          }
        });
      }
    });

    const nodeList = Array.from(nodeMap.values());
    return { nodes: nodeList, edges: edgeList };
  }, [rules, minLiftFilter, products]);

  // Canvas Force-Directed Simulation
  useEffect(() => {
    if (activeTab !== 'network') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Initialize positions in a circle
    const currentNodes = nodes.map((node, i) => {
      const angle = (i / (nodes.length || 1)) * 2 * Math.PI;
      const dist = Math.min(width, height) * 0.32;
      return {
        ...node,
        x: width / 2 + Math.cos(angle) * dist + (Math.random() - 0.5) * 40,
        y: height / 2 + Math.sin(angle) * dist + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0
      };
    });

    nodesRef.current = currentNodes;

    let iteration = 0;
    const maxIterations = 200;

    const tick = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Physics simulation step
      if (iteration < maxIterations) {
        iteration++;
        const k = 0.05; // spring constant
        const repulsion = 1200;

        // Repulsion between all nodes
        for (let i = 0; i < currentNodes.length; i++) {
          for (let j = i + 1; j < currentNodes.length; j++) {
            const n1 = currentNodes[i];
            const n2 = currentNodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < 300) {
              const force = (repulsion / (dist * dist));
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              n1.vx -= fx;
              n1.vy -= fy;
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }

        // Attraction along edges
        edges.forEach(edge => {
          const n1 = currentNodes.find(n => n.name === edge.source);
          const n2 = currentNodes.find(n => n.name === edge.target);
          if (n1 && n2) {
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const desiredDist = 120;
            const force = (dist - desiredDist) * k;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            n1.vx += fx;
            n1.vy += fy;
            n2.vx -= fx;
            n2.vy -= fy;
          }
        });

        // Center gravity and velocity dampening
        const cx = width / 2;
        const cy = height / 2;
        currentNodes.forEach(node => {
          node.vx += (cx - node.x) * 0.01;
          node.vy += (cy - node.y) * 0.01;
          node.vx *= 0.85;
          node.vy *= 0.85;
          node.x += node.vx;
          node.y += node.vy;

          // Keep in bounds
          node.x = Math.max(node.radius + 10, Math.min(width - node.radius - 10, node.x));
          node.y = Math.max(node.radius + 10, Math.min(height - node.radius - 10, node.y));
        });
      }

      // Render Canvas
      ctx.clearRect(0, 0, width, height);

      // Draw Edges
      edges.forEach(edge => {
        const n1 = currentNodes.find(n => n.name === edge.source);
        const n2 = currentNodes.find(n => n.name === edge.target);
        if (n1 && n2) {
          const isHighlighted = selectedNode && (selectedNode.name === n1.name || selectedNode.name === n2.name);
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = isHighlighted 
            ? 'rgba(56, 189, 248, 0.9)' 
            : `rgba(255, 255, 255, ${Math.min(0.5, Math.max(0.12, edge.lift / 12))})`;
          ctx.lineWidth = isHighlighted ? 2.5 : Math.min(4, Math.max(1, edge.lift / 2));
          ctx.stroke();
        }
      });

      // Draw Nodes
      currentNodes.forEach(node => {
        const isSelected = selectedNode?.name === node.name;
        const isConnected = selectedNode && edges.some(e => 
          (e.source === selectedNode.name && e.target === node.name) ||
          (e.target === selectedNode.name && e.source === node.name)
        );

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? '#ffffff' : node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isSelected ? 20 : (isConnected ? 12 : 6);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Border
        ctx.strokeStyle = isSelected ? '#0f62fe' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = isSelected ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Truncated text inside or below
        const shortName = node.name.length > 14 ? `${node.name.substring(0, 12)}..` : node.name;
        ctx.fillText(shortName, node.x, node.y + node.radius + 12);
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [nodes, edges, activeTab, selectedNode]);

  // Handle canvas click to select node
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = nodesRef.current.find(n => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 6;
    });

    setSelectedNode(clicked || null);
  };

  // Filtered Itemsets
  const filteredItemsets = useMemo(() => {
    return itemsets.filter(itemset => {
      const matchesLength = itemsetLengthFilter === 0 || itemset.length === itemsetLengthFilter;
      const matchesSearch = itemsetSearch === '' || itemset.items.some(i => i.toLowerCase().includes(itemsetSearch.toLowerCase()));
      return matchesLength && matchesSearch;
    }).sort((a, b) => b.support - a.support);
  }, [itemsets, itemsetLengthFilter, itemsetSearch]);

  // Category Affinity Matrix Calculation
  const categoryMatrixData = useMemo(() => {
    const catSet = new Set(products.map(p => p.category));
    const categories = Array.from(catSet);
    const matrix: Record<string, Record<string, number>> = {};

    categories.forEach(c1 => {
      matrix[c1] = {};
      categories.forEach(c2 => {
        matrix[c1][c2] = 0;
      });
    });

    transactions.forEach(t => {
      const txCats = Array.from(new Set(t.items.map(item => {
        const prod = products.find(p => p.name === item);
        return prod?.category || 'General';
      })));

      for (let i = 0; i < txCats.length; i++) {
        for (let j = 0; j < txCats.length; j++) {
          const c1 = txCats[i];
          const c2 = txCats[j];
          if (matrix[c1] && matrix[c1][c2] !== undefined) {
            matrix[c1][c2]++;
          }
        }
      }
    });

    return { categories, matrix };
  }, [products, transactions]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-emerald-400" />
            Market Basket Mining & Co-Purchase Network Analysis
          </h2>
          <p className="text-xs text-slate-400">
            Interactive pattern mining graph, FP-Tree / Apriori itemset lattice, and cross-category co-occurrence matrices.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('network')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'network'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            2D Force Graph
          </button>

          <button
            onClick={() => setActiveTab('itemsets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'itemsets'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Frequent Itemsets ({itemsets.length})
          </button>

          <button
            onClick={() => setActiveTab('category-matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'category-matrix'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Category Heatmap
          </button>
        </div>
      </div>

      {/* Tab 1: Force-Directed Co-Purchase Network Graph */}
      {activeTab === 'network' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Canvas Graph */}
          <div className="lg:col-span-8 glass-panel rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden h-[620px]">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Co-Purchase Topology Map
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  ({nodes.length} SKUs, {edges.length} Affinity Links)
                </span>
              </div>

              {/* Min Lift Slider */}
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1 text-xs">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400">Min Lift:</span>
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.2"
                  value={minLiftFilter}
                  onChange={(e) => setMinLiftFilter(Number(e.target.value))}
                  className="w-24 accent-blue-500 cursor-pointer"
                />
                <span className="font-mono text-blue-400 font-bold">{minLiftFilter.toFixed(1)}x</span>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full h-full cursor-grab active:cursor-grabbing rounded-xl mt-2"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800 z-10">
              <span>💡 Click any node to inspect connected companions & add to cart.</span>
              <span className="font-mono text-slate-300">Node size = Support | Line thickness = Lift</span>
            </div>
          </div>

          {/* Right Sidebar: Selected Node / Cluster Details */}
          <div className="lg:col-span-4 space-y-4">
            {selectedNode ? (
              <div className="glass-panel rounded-2xl p-5 space-y-4 border-blue-500/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {selectedNode.category}
                  </span>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{selectedNode.name}</h3>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span>Support: <strong className="text-emerald-400 font-mono">{(selectedNode.support * 100).toFixed(1)}%</strong></span>
                    <span>Sales: <strong className="text-white font-mono">{selectedNode.sales}</strong> txs</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Connected Add-on Links ({edges.filter(e => e.source === selectedNode.name || e.target === selectedNode.name).length}):
                  </div>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {edges
                      .filter(e => e.source === selectedNode.name || e.target === selectedNode.name)
                      .map((edge, idx) => {
                        const companion = edge.source === selectedNode.name ? edge.target : edge.source;
                        return (
                          <div key={idx} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between">
                            <span className="text-slate-200 font-medium line-clamp-1">{companion}</span>
                            <div className="text-right shrink-0">
                              <span className="text-amber-300 font-bold font-mono ml-2">Lift: {edge.lift.toFixed(2)}x</span>
                              <span className="text-[10px] text-slate-400 block font-mono">{Math.round(edge.confidence * 100)}% Conf</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const p = products.find(prod => prod.name === selectedNode.name);
                    if (p) onSelectProductForCart(p);
                  }}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Add SKU to Cart Simulator
                </button>
              </div>
            ) : (
              <div className="glass-panel rounded-2xl p-6 text-center space-y-3">
                <Network className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Interactive Graph Inspector</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click on any product bubble in the force-directed canvas to view all mathematically linked co-purchase companions, lift scores, and trigger real-time simulations.
                </p>
              </div>
            )}

            {/* Category Color Legend */}
            <div className="glass-panel rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Category Color Legend
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {Object.entries(categoryColors).slice(0, 10).map(([cat, color]) => (
                  <div key={cat} className="flex items-center gap-2 text-[11px] text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }}></span>
                    <span className="truncate">{cat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Frequent Itemsets Lattice Table */}
      {activeTab === 'itemsets' && (
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Filter by Itemset Size:</span>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
                {[0, 1, 2, 3].map(size => (
                  <button
                    key={size}
                    onClick={() => setItemsetLengthFilter(size)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      itemsetLengthFilter === size
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {size === 0 ? 'All' : `${size}-Itemsets`}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter item combinations..."
                value={itemsetSearch}
                onChange={(e) => setItemsetSearch(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-60"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Itemset Combination (Lattice Node)</th>
                  <th className="px-4 py-3">Size (k)</th>
                  <th className="px-4 py-3">Transaction Count</th>
                  <th className="px-4 py-3">Support %</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredItemsets.slice(0, 50).map((itemset, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-sans font-medium text-white">
                      <div className="flex flex-wrap gap-1.5">
                        {itemset.items.map((it, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 text-xs">
                            {it}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-semibold">{itemset.length}-item</td>
                    <td className="px-4 py-3 text-slate-300 font-bold">{itemset.count}</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">{(itemset.support * 100).toFixed(2)}%</td>
                    <td className="px-4 py-3 font-sans">
                      <button
                        onClick={() => {
                          const p = products.find(prod => prod.name === itemset.items[0]);
                          if (p) onSelectProductForCart(p);
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                      >
                        Simulate
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Cross-Category Heatmap Matrix */}
      {activeTab === 'category-matrix' && (
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Grid className="w-4 h-4 text-purple-400" />
              Cross-Category Co-Occurrence Density Heatmap
            </h3>
            <p className="text-xs text-slate-400">
              Evaluates cross-departmental basket bundling frequency to guide store layout optimization and digital cross-selling.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 p-2 bg-slate-950/60">
            <div className="min-w-[600px]">
              <table className="w-full text-center text-xs">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-slate-400 font-bold uppercase text-[10px]">Category</th>
                    {categoryMatrixData.categories.map(c => (
                      <th key={c} className="p-2 text-slate-300 font-bold text-[11px] truncate max-w-[100px]">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {categoryMatrixData.categories.map(rowCat => (
                    <tr key={rowCat}>
                      <td className="p-2 text-left text-slate-200 font-semibold text-xs whitespace-nowrap bg-slate-900/60">
                        {rowCat}
                      </td>
                      {categoryMatrixData.categories.map(colCat => {
                        const count = categoryMatrixData.matrix[rowCat]?.[colCat] || 0;
                        const maxCount = 400;
                        const opacity = Math.min(1, Math.max(0.08, count / maxCount));

                        return (
                          <td
                            key={colCat}
                            style={{
                              backgroundColor: `rgba(15, 98, 254, ${opacity})`,
                              color: opacity > 0.4 ? '#ffffff' : '#94a3b8'
                            }}
                            className="p-2 font-mono font-bold transition-all hover:ring-1 hover:ring-white/40 cursor-default"
                            title={`${rowCat} + ${colCat}: ${count} Co-purchases`}
                          >
                            {count}
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
      )}
    </div>
  );
};
