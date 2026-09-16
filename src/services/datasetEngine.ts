import Papa from 'papaparse';
import { Transaction, Product, DatasetMetadata } from '../types';
import { LoadedDataset } from './datasets/datasetRegistry';

export interface ColumnMapping {
  transactionIdCol?: string;
  itemCol?: string;
  categoryCol?: string;
  priceCol?: string;
  timestampCol?: string;
  customerIdCol?: string;
  isBasketRowFormat?: boolean; // true if each row is "Item A, Item B, Item C"
}

export function parseCustomCSV(
  fileContent: string,
  mapping?: ColumnMapping
): Promise<LoadedDataset> {
  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        try {
          const rawData = results.data as Record<string, any>[];
          if (!rawData || rawData.length === 0) {
            throw new Error('CSV file is empty or improperly formatted.');
          }

          const columns = Object.keys(rawData[0]);
          
          // Auto-detect columns if mapping not supplied
          const detectedMapping: ColumnMapping = mapping || autoDetectColumns(columns);

          let transactions: Transaction[] = [];
          const productMap = new Map<string, { category: string; price: number; count: number }>();

          if (detectedMapping.isBasketRowFormat || !detectedMapping.transactionIdCol) {
            // Each row is either a comma-separated basket or single row basket
            const firstCol = columns[0];
            rawData.forEach((row, idx) => {
              let items: string[] = [];
              if (detectedMapping.itemCol && row[detectedMapping.itemCol]) {
                const val = String(row[detectedMapping.itemCol]);
                items = val.split(/[,;|]/).map(s => s.trim()).filter(s => s.length > 0);
              } else {
                // Combine all non-empty columns in this row as items
                columns.forEach(col => {
                  if (row[col] && typeof row[col] === 'string') {
                    const parts = String(row[col]).split(/[,;|]/).map(s => s.trim()).filter(s => s.length > 0);
                    items.push(...parts);
                  }
                });
              }

              // Deduplicate items in transaction
              const uniqueItems = Array.from(new Set(items));
              if (uniqueItems.length > 0) {
                const totalAmount = uniqueItems.length * 4.50; // estimate
                transactions.push({
                  id: `TX-UP-${1000 + idx}`,
                  customerId: `CUST-${Math.floor(100 + Math.random() * 900)}`,
                  timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
                  items: uniqueItems,
                  totalAmount: Number(totalAmount.toFixed(2)),
                  itemCount: uniqueItems.length,
                  channel: 'Web',
                  paymentMethod: 'Credit Card',
                  dayOfWeek: (idx % 7),
                  hourOfDay: (idx * 3) % 24
                });

                uniqueItems.forEach(item => {
                  const existing = productMap.get(item) || { category: 'General', price: 4.50, count: 0 };
                  existing.count += 1;
                  productMap.set(item, existing);
                });
              }
            });
          } else {
            // Tall format: Group rows by transactionIdCol
            const txGroups = new Map<string, {
              items: Set<string>;
              customerId: string;
              timestamp: string;
              totalPrice: number;
            }>();

            rawData.forEach((row, idx) => {
              const txId = String(row[detectedMapping.transactionIdCol!] || `TX-${idx}`);
              const itemName = String(row[detectedMapping.itemCol!] || '').trim();
              if (!itemName || itemName.toLowerCase() === 'nan' || itemName.toLowerCase() === 'null') return;

              const category = detectedMapping.categoryCol && row[detectedMapping.categoryCol] 
                ? String(row[detectedMapping.categoryCol]).trim() 
                : 'General';
              
              const price = detectedMapping.priceCol && !isNaN(Number(row[detectedMapping.priceCol]))
                ? Number(row[detectedMapping.priceCol])
                : (productMap.get(itemName)?.price || (Math.floor(Math.random() * 20) + 5));

              const custId = detectedMapping.customerIdCol && row[detectedMapping.customerIdCol]
                ? String(row[detectedMapping.customerIdCol])
                : `CUST-${(idx % 250) + 1}`;

              const timestamp = detectedMapping.timestampCol && row[detectedMapping.timestampCol]
                ? String(row[detectedMapping.timestampCol])
                : new Date(Date.now() - Math.floor(Math.random() * 60) * 86400000).toISOString();

              if (!txGroups.has(txId)) {
                txGroups.set(txId, {
                  items: new Set<string>(),
                  customerId: custId,
                  timestamp,
                  totalPrice: 0
                });
              }

              const group = txGroups.get(txId)!;
              group.items.add(itemName);
              group.totalPrice += price;

              // Update product catalog
              const existing = productMap.get(itemName) || { category, price, count: 0 };
              existing.count += 1;
              existing.category = category !== 'General' ? category : existing.category;
              existing.price = price > 0 ? price : existing.price;
              productMap.set(itemName, existing);
            });

            transactions = Array.from(txGroups.entries()).map(([txId, group], index) => {
              const dateObj = new Date(group.timestamp);
              const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
              return {
                id: txId,
                customerId: group.customerId,
                timestamp: validDate.toISOString(),
                items: Array.from(group.items),
                totalAmount: Number(group.totalPrice.toFixed(2)),
                itemCount: group.items.size,
                channel: (['Web', 'Mobile App', 'In-Store'] as const)[index % 3],
                paymentMethod: (['Credit Card', 'PayPal', 'Apple Pay'] as const)[index % 3],
                dayOfWeek: validDate.getDay(),
                hourOfDay: validDate.getHours()
              };
            });
          }

          if (transactions.length === 0) {
            throw new Error('No valid transactions could be extracted from this dataset.');
          }

          // Build Products
          const totalTxs = transactions.length;
          const products: Product[] = Array.from(productMap.entries()).map(([name, data], idx) => ({
            id: `sku-upload-${idx + 1}`,
            name,
            category: data.category,
            price: Number(data.price.toFixed(2)),
            totalSales: data.count,
            support: Number((data.count / totalTxs).toFixed(4)),
            itemVelocity: Math.min(99, Math.max(50, Math.floor((data.count / totalTxs) * 100) + 40)),
            marginRate: Number((0.35 + (idx % 30) * 0.01).toFixed(2)),
            icon: '📦'
          }));

          const uniqueCats = new Set(products.map(p => p.category));
          const totalItemsCount = transactions.reduce((acc, t) => acc + t.items.length, 0);

          const metadata: DatasetMetadata = {
            id: `custom-upload-${Date.now()}`,
            name: 'Uploaded Transaction Dataset',
            description: `Custom ingested dataset with ${transactions.length} transactions across ${products.length} distinct items.`,
            industry: 'Custom E-Commerce / Retail',
            source: 'User Uploaded File',
            transactionCount: transactions.length,
            productCount: products.length,
            categoryCount: uniqueCats.size,
            avgBasketSize: Number((totalItemsCount / transactions.length).toFixed(1)),
            avgBasketValue: Number((transactions.reduce((acc, t) => acc + t.totalAmount, 0) / transactions.length).toFixed(2)),
            sparsity: Number((1 - (totalItemsCount / (transactions.length * products.length))).toFixed(3))
          };

          resolve({ metadata, products, transactions });
        } catch (err: any) {
          reject(err);
        }
      },
      error: (err: any) => reject(err)
    });
  });
}

function autoDetectColumns(columns: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};
  const lowerCols = columns.map(c => c.toLowerCase());

  // Transaction ID detection
  const txMatches = ['invoiceno', 'invoice_no', 'transaction_id', 'transactionid', 'order_id', 'orderid', 'basket_id', 'tx_id', 'receipt_no'];
  for (let i = 0; i < lowerCols.length; i++) {
    if (txMatches.some(m => lowerCols[i].includes(m))) {
      mapping.transactionIdCol = columns[i];
      break;
    }
  }

  // Item / Description detection
  const itemMatches = ['description', 'item_name', 'itemname', 'product', 'product_name', 'stockcode', 'items', 'item'];
  for (let i = 0; i < lowerCols.length; i++) {
    if (itemMatches.some(m => lowerCols[i].includes(m))) {
      mapping.itemCol = columns[i];
      break;
    }
  }

  // Category detection
  const catMatches = ['category', 'department', 'section', 'item_group', 'group'];
  for (let i = 0; i < lowerCols.length; i++) {
    if (catMatches.some(m => lowerCols[i].includes(m))) {
      mapping.categoryCol = columns[i];
      break;
    }
  }

  // Price detection
  const priceMatches = ['unitprice', 'unit_price', 'price', 'amount', 'item_price'];
  for (let i = 0; i < lowerCols.length; i++) {
    if (priceMatches.some(m => lowerCols[i].includes(m))) {
      mapping.priceCol = columns[i];
      break;
    }
  }

  // Customer ID detection
  const custMatches = ['customerid', 'customer_id', 'client_id', 'user_id', 'cust_id'];
  for (let i = 0; i < lowerCols.length; i++) {
    if (custMatches.some(m => lowerCols[i].includes(m))) {
      mapping.customerIdCol = columns[i];
      break;
    }
  }

  // Timestamp detection
  const timeMatches = ['invoicedate', 'invoice_date', 'date', 'timestamp', 'created_at', 'order_date', 'time'];
  for (let i = 0; i < lowerCols.length; i++) {
    if (timeMatches.some(m => lowerCols[i].includes(m))) {
      mapping.timestampCol = columns[i];
      break;
    }
  }

  return mapping;
}
