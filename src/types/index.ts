export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  totalSales: number;
  support: number;
  itemVelocity: number; // monthly trend score
  marginRate: number;
  icon?: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  timestamp: string;
  items: string[];
  totalAmount: number;
  itemCount: number;
  channel: 'Web' | 'Mobile App' | 'In-Store' | 'Marketplace';
  paymentMethod: 'Credit Card' | 'PayPal' | 'Apple Pay' | 'Store Credit';
  dayOfWeek: number; // 0 = Sun, 6 = Sat
  hourOfDay: number; // 0-23
}

export interface Itemset {
  items: string[];
  support: number;
  count: number;
  length: number;
}

export interface AssociationRule {
  id: string;
  antecedent: string[];
  consequent: string[];
  support: number;
  confidence: number;
  lift: number;
  leverage: number;
  conviction: number;
  zhang: number;
  naturalLanguage: string;
}

export interface DatasetMetadata {
  id: string;
  name: string;
  description: string;
  industry: string;
  source: string;
  transactionCount: number;
  productCount: number;
  categoryCount: number;
  avgBasketSize: number;
  avgBasketValue: number;
  sparsity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Recommendation {
  product: Product;
  score: number; // 0 to 1 normalized score
  lift: number;
  confidence: number;
  strategy: 'association_rule' | 'collaborative_filtering' | 'frequent_itemset' | 'hybrid';
  reason: string;
  triggerItems: string[];
  discountEligible?: boolean;
  bundleDiscountPercent?: number;
}

export interface BenchmarkMetrics {
  algorithm: 'Apriori' | 'FP-Growth' | 'ECLAT' | 'Item-Item CF';
  executionTimeMs: number;
  memoryMb: number;
  itemsetsFound: number;
  rulesGenerated: number;
  precisionAtK: number;
  recallAtK: number;
  mapAtK: number;
  ndcgAtK: number;
}

export interface RFMCluster {
  id: string;
  name: string;
  description: string;
  percentage: number;
  count: number;
  avgRecencyDays: number;
  avgFrequency: number;
  avgMonetary: number;
  recommendedAction: string;
  color: string;
}

export interface CategoryAffinity {
  categoryA: string;
  categoryB: string;
  affinityScore: number;
  pairCount: number;
}

export interface AnomalyRecord {
  transactionId: string;
  items: string[];
  itemCount: number;
  totalAmount: number;
  anomalyType: 'Extremely Large Basket' | 'High-Value Outlier' | 'Unusual Cross-Category Combo' | 'Rare SKU Spike';
  severity: 'high' | 'medium' | 'low';
  explanation: string;
}

export type ActiveTab = 
  | 'dashboard'
  | 'product-analysis'
  | 'market-basket'
  | 'association-rules'
  | 'recommendation-engine'
  | 'transaction-insights'
  | 'transaction-records'
  | 'model-performance';

