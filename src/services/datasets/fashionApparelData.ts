import { Product, Transaction, DatasetMetadata } from '../../types';

export const fashionMetadata: DatasetMetadata = {
  id: 'fashion-apparel',
  name: 'Fashion Apparel & Outfit Bundles',
  description: 'Style co-purchases of streetwear, denim, sneakers, tops, outerwear, and accessories.',
  industry: 'Fashion / Apparel E-Commerce',
  source: 'Kaggle Fashion Retail Transactions',
  transactionCount: 800,
  productCount: 24,
  categoryCount: 5,
  avgBasketSize: 3.2,
  avgBasketValue: 92.40,
  sparsity: 0.85
};

export const fashionProducts: Product[] = [
  // Tops
  { id: 'f1', name: 'Heavyweight Oversized Cotton Tee (White)', category: 'Tops', price: 28.00, totalSales: 340, support: 0.425, itemVelocity: 94, marginRate: 0.65, icon: '👕' },
  { id: 'f2', name: 'Vintage Washed Graphic Tee', category: 'Tops', price: 34.00, totalSales: 280, support: 0.350, itemVelocity: 88, marginRate: 0.68, icon: '👕' },
  { id: 'f3', name: 'Relaxed French Terry Hoodie', category: 'Outerwear', price: 68.00, totalSales: 310, support: 0.387, itemVelocity: 92, marginRate: 0.62, icon: '🧥' },
  { id: 'f4', name: 'Classic Denim Trucker Jacket', category: 'Outerwear', price: 89.00, totalSales: 210, support: 0.262, itemVelocity: 80, marginRate: 0.58, icon: '🧥' },
  // Bottoms
  { id: 'f5', name: 'Straight Leg Vintage Blue Jeans', category: 'Bottoms', price: 78.00, totalSales: 360, support: 0.450, itemVelocity: 95, marginRate: 0.60, icon: '👖' },
  { id: 'f6', name: 'Utility Cargo Pants Olive', category: 'Bottoms', price: 72.00, totalSales: 290, support: 0.362, itemVelocity: 89, marginRate: 0.62, icon: '👖' },
  { id: 'f7', name: 'Pleated Chino Trousers Black', category: 'Bottoms', price: 64.00, totalSales: 220, support: 0.275, itemVelocity: 81, marginRate: 0.59, icon: '👖' },
  // Footwear
  { id: 'f8', name: 'Retro Low Leather Sneakers (White)', category: 'Footwear', price: 110.00, totalSales: 330, support: 0.412, itemVelocity: 93, marginRate: 0.48, icon: '👟' },
  { id: 'f9', name: 'Chunky Skate Sneakers Grey', category: 'Footwear', price: 95.00, totalSales: 240, support: 0.300, itemVelocity: 84, marginRate: 0.50, icon: '👟' },
  // Accessories
  { id: 'f10', name: 'Canvas Crossbody Sling Bag', category: 'Accessories', price: 32.00, totalSales: 290, support: 0.362, itemVelocity: 89, marginRate: 0.70, icon: '👜' },
  { id: 'f11', name: 'Ribbed Knit Beanie Charcoal', category: 'Accessories', price: 22.00, totalSales: 250, support: 0.312, itemVelocity: 82, marginRate: 0.72, icon: '🧢' },
  { id: 'f12', name: 'Full Grain Leather Belt Brown', category: 'Accessories', price: 38.00, totalSales: 260, support: 0.325, itemVelocity: 85, marginRate: 0.68, icon: '🥋' },
  { id: 'f13', name: 'Retro Square Frame Sunglasses', category: 'Accessories', price: 42.00, totalSales: 200, support: 0.250, itemVelocity: 78, marginRate: 0.75, icon: '🕶️' },
  { id: 'f14', name: 'Cushioned Crew Socks 3-Pack', category: 'Accessories', price: 16.00, totalSales: 320, support: 0.400, itemVelocity: 91, marginRate: 0.74, icon: '🧦' }
];

export function generateFashionTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const channels: ('Web' | 'Mobile App' | 'In-Store')[] = ['Mobile App', 'Web', 'Mobile App'];
  const paymentMethods: ('Credit Card' | 'Apple Pay' | 'PayPal')[] = ['Apple Pay', 'Credit Card', 'PayPal'];

  const patterns = [
    {
      core: ['Straight Leg Vintage Blue Jeans', 'Heavyweight Oversized Cotton Tee (White)', 'Retro Low Leather Sneakers (White)'],
      extras: ['Full Grain Leather Belt Brown', 'Cushioned Crew Socks 3-Pack'],
      weight: 240
    },
    {
      core: ['Utility Cargo Pants Olive', 'Relaxed French Terry Hoodie', 'Chunky Skate Sneakers Grey'],
      extras: ['Canvas Crossbody Sling Bag', 'Ribbed Knit Beanie Charcoal'],
      weight: 230
    },
    {
      core: ['Classic Denim Trucker Jacket', 'Heavyweight Oversized Cotton Tee (White)', 'Pleated Chino Trousers Black'],
      extras: ['Retro Square Frame Sunglasses', 'Retro Low Leather Sneakers (White)'],
      weight: 180
    },
    {
      core: ['Vintage Washed Graphic Tee', 'Straight Leg Vintage Blue Jeans', 'Canvas Crossbody Sling Bag'],
      extras: ['Retro Square Frame Sunglasses', 'Cushioned Crew Socks 3-Pack'],
      weight: 150
    }
  ];

  let txIdCounter = 8001;
  const startDate = new Date(2026, 6, 1);

  patterns.forEach(pattern => {
    for (let i = 0; i < pattern.weight; i++) {
      const basketSet = new Set<string>();
      const shuffledCore = [...pattern.core].sort(() => 0.5 - Math.random());
      const coreCount = Math.floor(Math.random() * 2) + 2;
      shuffledCore.slice(0, coreCount).forEach(item => basketSet.add(item));

      if (Math.random() > 0.35) {
        basketSet.add(pattern.extras[Math.floor(Math.random() * pattern.extras.length)]);
      }
      if (Math.random() > 0.5) {
        basketSet.add(fashionProducts[Math.floor(Math.random() * fashionProducts.length)].name);
      }

      const basketItems = Array.from(basketSet);
      if (basketItems.length < 2) basketItems.push('Heavyweight Oversized Cotton Tee (White)');

      const totalAmount = Number(basketItems.reduce((sum, itemName) => {
        const p = fashionProducts.find(prod => prod.name === itemName);
        return sum + (p ? p.price : 35.00);
      }, 0).toFixed(2));

      const dayOffset = Math.floor(Math.random() * 45);
      const hour = Math.floor(Math.random() * 12) + 11;
      const minute = Math.floor(Math.random() * 60);
      const txDate = new Date(startDate.getTime() + dayOffset * 86400000 + hour * 3600000 + minute * 60000);

      transactions.push({
        id: `FASH-${txIdCounter++}`,
        customerId: `STYLE-${Math.floor(1000 + Math.random() * 900)}`,
        timestamp: txDate.toISOString(),
        items: basketItems,
        totalAmount,
        itemCount: basketItems.length,
        channel: channels[Math.floor(Math.random() * channels.length)],
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        dayOfWeek: txDate.getDay(),
        hourOfDay: hour
      });
    }
  });

  return transactions;
}
