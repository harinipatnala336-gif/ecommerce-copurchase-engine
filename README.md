# 🛒 E-Commerce Product Co-Purchase & Recommendation Engine

> **Enterprise-grade Market Basket Analysis (MBA), Association Rule Mining (Apriori & FP-Growth), Interactive 2D Network Topology Graphs, Real-Time Shopping Cart Recommendation Simulator, and RFM Customer Insights.**

---

## 🌟 Key Highlights & Features

- **🚀 Universal Transaction Engine**: Pre-loaded with 5 diverse Kaggle e-commerce datasets (*Instacart Grocery, UK Online Retail, Bakery & Cafe, Electronics & Hardware, Fashion Apparel*) + Universal CSV/JSON/Excel Uploader supporting any custom transaction schema.
- **⚡ High-Performance In-Browser Data Mining**: Full implementations of both **Apriori Algorithm** (downward-closure candidate pruning) and **FP-Growth (FP-Tree)** mining.
- **🌐 2D Physics-Based Force-Directed Co-Purchase Graph**: Interactive network canvas with draggable nodes, category clusters, zoom/pan, and dynamic lift filtering.
- **🧠 Natural Language Rule Translator**: Automatically translates mathematical rule records (Support, Confidence, Lift, Leverage, Conviction, Zhang's metric) into actionable merchandising directives.
- **🛍️ Live Shopping Cart Recommendation Simulator**: Interactive storefront with real-time add-on recommendations, Explainable AI (XAI) diagnostic cards, and dynamic "Bundle & Save" promotional discount calculators.
- **📊 Customer Segmentation & Behavioral Analytics**: Automated Recency-Frequency-Monetary (RFM) customer clustering (*Champions, Loyalists, Potential Adopters, At-Risk*) and 24x7 Day-Hour transaction intensity heatmaps.
- **📈 Comprehensive Algorithmic Benchmarking Suite**: Head-to-head empirical testing comparing Apriori vs FP-Growth vs Item-Item Collaborative Filtering across Execution Speed (ms), Memory Footprint (MB), Precision@K, Recall@K, MAP, and NDCG.
- **📑 1-Click Executive PDF & Word Report Export**: Generates publication-ready case study documentation with tables, mathematical formulas, and benchmark comparisons.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 (Hooks, Context, Memoization) |
| **Language** | TypeScript 5.7 (Strict Mode) |
| **Build & Dev Tool** | Vite 6 |
| **Styling & Design** | Tailwind CSS 3.4 (Dark Modern Analytics Theme) |
| **Icons & Visuals** | Lucide React |
| **Data Visualization** | Recharts & Custom HTML5 Canvas 2D Physics Engine |
| **Data Parsing** | PapaParse Streaming CSV Parser |
| **Document Export** | jsPDF + jsPDF-AutoTable |

---

## 📦 Project Directory Structure

```
ecommerce-copurchase-engine/
├── public/                      # Static assets & downloadable reports
├── src/
│   ├── components/              # Modular UI components
│   │   ├── Dashboard.tsx        # Executive KPI dashboard & category charts
│   │   ├── ProductAnalysis.tsx  # SKU deep-dive & affinity radar
│   │   ├── MarketBasketAnalysis.tsx # Force-directed co-purchase graph & itemsets
│   │   ├── AssociationRules.tsx # Rule miner, dynamic sliders & NLP translator
│   │   ├── RecommendationSimulator.tsx # Live cart & XAI recommendation engine
│   │   ├── TransactionInsights.tsx # RFM clustering & 24x7 heatmap
│   │   ├── TransactionRecords.tsx  # Data grid & anomaly detector
│   │   ├── ModelPerformance.tsx # Apriori vs FP-Growth vs CF benchmark suite
│   │   ├── Navbar.tsx           # Global header & dataset switcher
│   │   ├── Sidebar.tsx          # Module navigation sidebar
│   │   ├── FileUploadModal.tsx  # Universal CSV/JSON custom dataset ingestor
│   │   └── ReceiptModal.tsx     # Digital receipt inspector modal
│   ├── services/                # Business logic & computational kernels
│   │   ├── datasets/            # 5 Preloaded real-world Kaggle datasets
│   │   ├── datasetEngine.ts     # Universal dataset parser & column mapper
│   │   ├── marketBasketMining.ts# Apriori, FP-Growth, CF & Benchmark engine
│   │   └── pdfReportGenerator.ts# Professional PDF report compiler
│   ├── types/                   # TypeScript interfaces & data models
│   ├── App.tsx                  # Root state orchestration
│   ├── main.tsx                 # React entry point
│   └── index.css                # Tailwind CSS core styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ecommerce-copurchase-engine.git
   cd ecommerce-copurchase-engine
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📊 Evaluation & Mathematical Formulations

- **Support**: $\text{Support}(A \to B) = \frac{|\{T \in \mathcal{D} \mid (A \cup B) \subseteq T\}|}{|\mathcal{D}|}$
- **Confidence**: $\text{Confidence}(A \to B) = \frac{\text{Support}(A \cup B)}{\text{Support}(A)} = P(B \mid A)$
- **Lift**: $\text{Lift}(A \to B) = \frac{\text{Confidence}(A \to B)}{\text{Support}(B)} = \frac{P(A \cap B)}{P(A) \cdot P(B)}$
- **Leverage**: $\text{Leverage} = \text{Support}(A \cup B) - (\text{Support}(A) \times \text{Support}(B))$
- **Conviction**: $\text{Conviction} = \frac{1 - \text{Support}(B)}{1 - \text{Confidence}(A \to B)}$
- **Cosine Similarity**: $\text{Sim}(i, j) = \frac{|\mathcal{B}(i) \cap \mathcal{B}(j)|}{\sqrt{|\mathcal{B}(i)| \cdot |\mathcal{B}(j)|}}$

---

## 📜 License
This project is licensed under the MIT License.
