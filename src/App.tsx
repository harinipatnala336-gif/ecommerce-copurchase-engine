import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  Sidebar 
} from './components/Sidebar';
import { 
  Dashboard 
} from './components/Dashboard';
import { 
  ProductAnalysis 
} from './components/ProductAnalysis';
import { 
  MarketBasketAnalysis 
} from './components/MarketBasketAnalysis';
import { 
  AssociationRules 
} from './components/AssociationRules';
import { 
  RecommendationSimulator 
} from './components/RecommendationSimulator';
import { 
  TransactionInsights 
} from './components/TransactionInsights';
import { 
  TransactionRecords 
} from './components/TransactionRecords';
import { 
  ModelPerformance 
} from './components/ModelPerformance';
import { 
  FileUploadModal 
} from './components/FileUploadModal';
import { 
  ReceiptModal 
} from './components/ReceiptModal';
import { 
  ActiveTab, 
  Product, 
  Transaction, 
  CartItem 
} from './types';
import { 
  loadDatasetById, 
  LoadedDataset 
} from './services/datasets/datasetRegistry';
import { 
  runFPGrowth, 
  generateAssociationRules, 
  buildItemSimilarityMatrix, 
  runBenchmarkSuite 
} from './services/marketBasketMining';
import { 
  generateIBMProjectReport 
} from './services/pdfReportGenerator';

export const App: React.FC = () => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('instacart-groceries');
  const [currentDataset, setCurrentDataset] = useState<LoadedDataset>(() => loadDatasetById('instacart-groceries'));
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Mining parameters
  const [minSupport, setMinSupport] = useState<number>(0.05);
  const [minConfidence, setMinConfidence] = useState<number>(0.30);
  const [minLift, setMinLift] = useState<number>(1.2);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);

  // Load preset dataset when selectedDatasetId changes
  const handleSelectDataset = useCallback((id: string) => {
    setSelectedDatasetId(id);
    if (!id.startsWith('custom-upload')) {
      const data = loadDatasetById(id);
      setCurrentDataset(data);
      // Pre-seed initial cart with 1 popular item
      if (data.products.length > 0) {
        setCartItems([{ product: data.products[0], quantity: 1 }]);
      }
    }
  }, []);

  // Handle custom dataset uploaded
  const handleDatasetLoaded = useCallback((dataset: LoadedDataset) => {
    setCurrentDataset(dataset);
    setSelectedDatasetId(dataset.metadata.id);
    if (dataset.products.length > 0) {
      setCartItems([{ product: dataset.products[0], quantity: 1 }]);
    }
  }, []);

  // Compute frequent itemsets using FP-Growth
  const { itemsets } = useMemo(() => {
    return runFPGrowth(currentDataset.transactions, minSupport, 3);
  }, [currentDataset.transactions, minSupport]);

  // Compute association rules
  const rules = useMemo(() => {
    return generateAssociationRules(
      itemsets,
      currentDataset.transactions.length,
      minConfidence,
      minLift
    );
  }, [itemsets, currentDataset.transactions.length, minConfidence, minLift]);

  // Compute Item-Item Collaborative Filtering Similarity Matrix
  const similarityMatrix = useMemo(() => {
    return buildItemSimilarityMatrix(currentDataset.transactions, currentDataset.products);
  }, [currentDataset.transactions, currentDataset.products]);

  // Compute benchmark suite
  const benchmark = useMemo(() => {
    return runBenchmarkSuite(
      currentDataset.transactions,
      currentDataset.products,
      minSupport,
      minConfidence
    );
  }, [currentDataset.transactions, currentDataset.products, minSupport, minConfidence]);

  // Cart Handlers
  const handleAddToCart = useCallback((product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const handleRemoveFromCart = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const handleUpdateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [handleRemoveFromCart]);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const handleLoadPresetBasket = useCallback((itemNames: string[]) => {
    const newItems: CartItem[] = [];
    itemNames.forEach(name => {
      const p = currentDataset.products.find(prod => prod.name === name);
      if (p) {
        newItems.push({ product: p, quantity: 1 });
      }
    });
    setCartItems(newItems);
  }, [currentDataset.products]);

  // Add items to cart and open simulator
  const handleOpenCartWithItems = useCallback((items: string[]) => {
    handleLoadPresetBasket(items);
    setActiveTab('recommendation-engine');
  }, [handleLoadPresetBasket]);

  // Export PDF Report
  const handleExportPDF = useCallback(() => {
    const estimatedRevenueBoost = Math.round(
      currentDataset.metadata.transactionCount * currentDataset.metadata.avgBasketValue * 0.184
    );
    generateIBMProjectReport(
      currentDataset.metadata,
      rules,
      benchmark,
      currentDataset.products,
      estimatedRevenueBoost
    );
  }, [currentDataset, rules, benchmark]);

  // Initialize initial cart with first product on mount
  useEffect(() => {
    if (currentDataset.products.length > 0 && cartItems.length === 0) {
      setCartItems([{ product: currentDataset.products[0], quantity: 1 }]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        currentMetadata={currentDataset.metadata}
        selectedDatasetId={selectedDatasetId}
        onSelectDataset={handleSelectDataset}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenCart={() => setActiveTab('recommendation-engine')}
        cartItemCount={cartItems.reduce((acc, c) => acc + c.quantity, 0)}
        onExportReport={handleExportPDF}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-3 lg:p-6 gap-6">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          rulesCount={rules.length}
          transactionsCount={currentDataset.transactions.length}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard
              metadata={currentDataset.metadata}
              products={currentDataset.products}
              transactions={currentDataset.transactions}
              rules={rules}
              onNavigateTab={setActiveTab}
              onOpenCartWithItems={handleOpenCartWithItems}
            />
          )}

          {activeTab === 'product-analysis' && (
            <ProductAnalysis
              products={currentDataset.products}
              transactions={currentDataset.transactions}
              rules={rules}
              onSelectProductForCart={(p) => {
                handleAddToCart(p);
                setActiveTab('recommendation-engine');
              }}
            />
          )}

          {activeTab === 'market-basket' && (
            <MarketBasketAnalysis
              products={currentDataset.products}
              transactions={currentDataset.transactions}
              itemsets={itemsets}
              rules={rules}
              minSupport={minSupport}
              onMinSupportChange={setMinSupport}
              onSelectProductForCart={(p) => {
                handleAddToCart(p);
                setActiveTab('recommendation-engine');
              }}
            />
          )}

          {activeTab === 'association-rules' && (
            <AssociationRules
              rules={rules}
              minSupport={minSupport}
              minConfidence={minConfidence}
              minLift={minLift}
              onMinSupportChange={setMinSupport}
              onMinConfidenceChange={setMinConfidence}
              onMinLiftChange={setMinLift}
              onSelectProductForCart={(p) => {
                handleAddToCart(p);
                setActiveTab('recommendation-engine');
              }}
              products={currentDataset.products}
            />
          )}

          {activeTab === 'recommendation-engine' && (
            <RecommendationSimulator
              products={currentDataset.products}
              rules={rules}
              similarityMatrix={similarityMatrix}
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
              onClearCart={handleClearCart}
              onLoadPresetBasket={handleLoadPresetBasket}
            />
          )}

          {activeTab === 'transaction-insights' && (
            <TransactionInsights
              transactions={currentDataset.transactions}
              metadata={currentDataset.metadata}
            />
          )}

          {activeTab === 'transaction-records' && (
            <TransactionRecords
              transactions={currentDataset.transactions}
              products={currentDataset.products}
              rules={rules}
              onOpenReceipt={(tx) => setSelectedReceiptTx(tx)}
              onOpenUpload={() => setIsUploadModalOpen(true)}
            />
          )}

          {activeTab === 'model-performance' && (
            <ModelPerformance
              benchmark={benchmark}
              transactions={currentDataset.transactions}
              products={currentDataset.products}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDatasetLoaded={handleDatasetLoaded}
      />

      <ReceiptModal
        transaction={selectedReceiptTx}
        products={currentDataset.products}
        rules={rules}
        onClose={() => setSelectedReceiptTx(null)}
      />
    </div>
  );
};

export default App;
