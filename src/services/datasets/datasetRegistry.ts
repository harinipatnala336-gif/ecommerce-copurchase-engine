import { DatasetMetadata, Product, Transaction } from '../../types';
import { instacartMetadata, instacartProducts, generateInstacartTransactions } from './instacartData';
import { ukRetailMetadata, ukRetailProducts, generateUKRetailTransactions } from './ukRetailData';
import { bakeryCafeMetadata, bakeryCafeProducts, generateBakeryTransactions } from './bakeryCafeData';
import { electronicsMetadata, electronicsProducts, generateElectronicsTransactions } from './electronicsTechData';
import { fashionMetadata, fashionProducts, generateFashionTransactions } from './fashionApparelData';

export interface LoadedDataset {
  metadata: DatasetMetadata;
  products: Product[];
  transactions: Transaction[];
}

export const PRESET_DATASETS: Record<string, {
  metadata: DatasetMetadata;
  products: Product[];
  getTransactions: () => Transaction[];
}> = {
  'instacart-groceries': {
    metadata: instacartMetadata,
    products: instacartProducts,
    getTransactions: generateInstacartTransactions
  },
  'uk-online-retail': {
    metadata: ukRetailMetadata,
    products: ukRetailProducts,
    getTransactions: generateUKRetailTransactions
  },
  'bakery-cafe': {
    metadata: bakeryCafeMetadata,
    products: bakeryCafeProducts,
    getTransactions: generateBakeryTransactions
  },
  'electronics-tech': {
    metadata: electronicsMetadata,
    products: electronicsProducts,
    getTransactions: generateElectronicsTransactions
  },
  'fashion-apparel': {
    metadata: fashionMetadata,
    products: fashionProducts,
    getTransactions: generateFashionTransactions
  }
};

export function loadDatasetById(id: string): LoadedDataset {
  const preset = PRESET_DATASETS[id] || PRESET_DATASETS['instacart-groceries'];
  const transactions = preset.getTransactions();
  
  // Recalculate exact dynamic stats
  const uniqueItems = new Set<string>();
  let totalItemsInBaskets = 0;
  let totalRevenue = 0;

  transactions.forEach(tx => {
    tx.items.forEach(item => uniqueItems.add(item));
    totalItemsInBaskets += tx.items.length;
    totalRevenue += tx.totalAmount;
  });

  const metadata: DatasetMetadata = {
    ...preset.metadata,
    transactionCount: transactions.length,
    productCount: uniqueItems.size,
    avgBasketSize: Number((totalItemsInBaskets / transactions.length).toFixed(1)),
    avgBasketValue: Number((totalRevenue / transactions.length).toFixed(2))
  };

  return {
    metadata,
    products: preset.products,
    transactions
  };
}
