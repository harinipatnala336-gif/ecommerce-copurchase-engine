import React from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Layers, 
  Zap, 
  Download,
  HelpCircle,
  Code2
} from 'lucide-react';
import { DatasetMetadata } from '../types';

interface ProjectReviewerGuideProps {
  metadata: DatasetMetadata;
  onExportReport: () => void;
}

export const ProjectReviewerGuide: React.FC<ProjectReviewerGuideProps> = ({
  metadata,
  onExportReport
}) => {
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Hero Defense Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                IBM Project #17 Defense Documentation
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              E-Commerce Product Co-Purchase & Recommendation Engine
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Industrial-grade implementation documentation, mathematical formalisms, algorithmic benchmarks, and evaluation rubric defense.
            </p>
          </div>

          <button
            onClick={onExportReport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4" />
            Download Defense PDF Report
          </button>
        </div>
      </div>

      {/* Section 1: How This Solution Overcomes Existing Drawbacks */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">
            1. Overcoming Drawbacks of Existing Web Applications
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 space-y-2">
            <div className="font-bold text-rose-400">Limitations in Existing Solutions:</div>
            <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
              <li>Hardcoded toy data (cannot analyze arbitrary custom transactional CSVs).</li>
              <li>Superficial pairwise counts without true Apriori or FP-Tree candidate pruning.</li>
              <li>Static rule tables with zero natural-language business translation.</li>
              <li>No real-time shopping cart simulator to test recommendations dynamically.</li>
              <li>Lack of transparent algorithmic explainability ("Why was item X recommended?").</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
            <div className="font-bold text-emerald-400">Our Advanced Solution Innovations:</div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li><strong>Universal Ingestion Engine</strong>: Auto-parses tall or wide transactional CSVs with auto-column mapping.</li>
              <li><strong>Full Algorithmic Engine</strong>: In-browser Apriori, FP-Growth, and Cosine Collaborative Filtering.</li>
              <li><strong>Interactive 2D Force Graph</strong>: Physics-based visual topology of co-purchased item clusters.</li>
              <li><strong>Live Cart Simulator & Bundle Deals</strong>: Real-time dynamic add-to-cart recommendation updates with discount triggers.</li>
              <li><strong>Mathematical Explainability Audit</strong>: Transparent confidence & lift derivation for reviewers.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 2: Mathematical Formulations Guide */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-white">
            2. Mathematical Formulations & Rule Evaluation Metrics
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              1. Itemset Support P(A ∩ B)
            </div>
            <div className="p-2 rounded bg-slate-950 font-mono text-xs text-slate-200">
              Support(A ➔ B) = Count(A ∪ B) / N
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Measures the frequency with which both itemset A and itemset B appear together across the entire database of N transactions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              2. Rule Confidence P(B | A)
            </div>
            <div className="p-2 rounded bg-slate-950 font-mono text-xs text-slate-200">
              Confidence(A ➔ B) = Support(A ∪ B) / Support(A)
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Conditional probability that a customer buys item B given that they have already placed item A into their shopping basket.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              3. Lift Multiplier (Correlation Strength)
            </div>
            <div className="p-2 rounded bg-slate-950 font-mono text-xs text-slate-200">
              Lift(A ➔ B) = Confidence(A ➔ B) / Support(B)
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Values &gt; 1.0 indicate strong positive co-purchase correlation (e.g. Lift = 3.5x means customers are 3.5 times more likely to purchase B when A is bought).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              4. Item-Item Cosine Similarity
            </div>
            <div className="p-2 rounded bg-slate-950 font-mono text-xs text-slate-200">
              Sim(i, j) = |Baskets(i) ∩ Baskets(j)| / sqrt(|Baskets(i)| * |Baskets(j)|)
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Geometric cosine angle between item interaction vectors, providing continuous affinity scores across all catalog items.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Reviewer Inspection Walkthrough */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">
            3. Recommended Project Reviewer Demonstration Walkthrough
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">1</span>
            <div>
              <div className="font-bold text-white">Switch Datasets or Ingest Custom CSV</div>
              <p className="text-slate-400 mt-0.5">
                Use the top navigation bar to toggle between Instacart, UK Retail, French Bakery, Electronics, and Fashion datasets, or click "Upload CSV" to parse any custom transaction file.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">2</span>
            <div>
              <div className="font-bold text-white">Inspect Co-Purchase Force-Directed Graph</div>
              <p className="text-slate-400 mt-0.5">
                Navigate to "Market Basket & Graphs" tab to interact with the 2D physics-based co-purchase canvas. Click any product bubble to isolate its connected companion items and lift links.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">3</span>
            <div>
              <div className="font-bold text-white">Tune Live Mining Thresholds & Review NLP Translations</div>
              <p className="text-slate-400 mt-0.5">
                Navigate to "Association Rules Miner" tab. Adjust Min Support, Confidence, and Lift sliders. Notice how the rule set and natural-language translations update dynamically in real time.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">4</span>
            <div>
              <div className="font-bold text-white">Simulate Live E-Commerce Shopping Cart Checkout</div>
              <p className="text-slate-400 mt-0.5">
                Navigate to "Live Recommendation Engine" tab. Add items from the catalog into the cart, toggle between Hybrid, MBA Rules, and Collaborative Filtering, click "Explain Why", and test bundle checkout.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">5</span>
            <div>
              <div className="font-bold text-white">Review Head-to-Head Algorithmic Benchmark & Export PDF</div>
              <p className="text-slate-400 mt-0.5">
                Navigate to "Model Performance" to inspect Apriori vs FP-Growth runtime and precision comparisons, then click "Export Defense PDF" to generate the printable executive project summary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
