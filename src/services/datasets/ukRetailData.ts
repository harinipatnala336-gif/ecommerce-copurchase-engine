import { Product, Transaction, DatasetMetadata } from '../../types';

export const ukRetailMetadata: DatasetMetadata = {
  id: 'uk-online-retail',
  name: 'UK Online Retail Co-Purchase & Giftware',
  description: 'UCI Machine Learning / Kaggle UK Online Retail dataset containing transactions of registered online giftware and homeware store.',
  industry: 'Giftware / Home & Living',
  source: 'UCI Machine Learning Repository & Kaggle',
  transactionCount: 1100,
  productCount: 36,
  categoryCount: 6,
  avgBasketSize: 5.2,
  avgBasketValue: 42.80,
  sparsity: 0.86
};

export const ukRetailProducts: Product[] = [
  // Kitchen & Dining
  { id: 'uk1', name: 'Regency Teapot Roses', category: 'Kitchen & Dining', price: 9.95, totalSales: 310, support: 0.281, itemVelocity: 85, marginRate: 0.55, icon: '🫖' },
  { id: 'uk2', name: 'Regency Sugar Bowl Roses', category: 'Kitchen & Dining', price: 4.25, totalSales: 280, support: 0.254, itemVelocity: 82, marginRate: 0.58, icon: '🥣' },
  { id: 'uk3', name: 'Regency Milk Jug Roses', category: 'Kitchen & Dining', price: 4.95, totalSales: 275, support: 0.250, itemVelocity: 83, marginRate: 0.57, icon: '🥛' },
  { id: 'uk4', name: 'Regency Tea Cups & Saucers 4pc', category: 'Kitchen & Dining', price: 14.50, totalSales: 260, support: 0.236, itemVelocity: 80, marginRate: 0.52, icon: '☕' },
  { id: 'uk5', name: 'Set of 3 Butterfly Cake Tins', category: 'Kitchen & Dining', price: 8.95, totalSales: 210, support: 0.190, itemVelocity: 74, marginRate: 0.50, icon: '🍰' },
  // Home Decor
  { id: 'uk6', name: 'White Hanging Heart T-Light Holder', category: 'Home Decor', price: 2.95, totalSales: 420, support: 0.381, itemVelocity: 94, marginRate: 0.65, icon: '🕯️' },
  { id: 'uk7', name: 'Red Hanging Heart T-Light Holder', category: 'Home Decor', price: 2.95, totalSales: 340, support: 0.309, itemVelocity: 89, marginRate: 0.65, icon: '❤️' },
  { id: 'uk8', name: 'Cream Heart Wooden Wall Plaque', category: 'Home Decor', price: 5.50, totalSales: 220, support: 0.200, itemVelocity: 72, marginRate: 0.60, icon: '🖼️' },
  { id: 'uk9', name: 'Vintage Glass Scent Bottle', category: 'Home Decor', price: 6.95, totalSales: 195, support: 0.177, itemVelocity: 69, marginRate: 0.58, icon: '🧴' },
  { id: 'uk10', name: 'Antique Brass Photo Frame', category: 'Home Decor', price: 7.95, totalSales: 180, support: 0.163, itemVelocity: 68, marginRate: 0.55, icon: '🖼️' },
  // Bags & Storage
  { id: 'uk11', name: 'Jumbo Bag Red Retrospot', category: 'Bags & Storage', price: 2.08, totalSales: 390, support: 0.354, itemVelocity: 92, marginRate: 0.70, icon: '👜' },
  { id: 'uk12', name: 'Jumbo Bag Vintage Leaf', category: 'Bags & Storage', price: 2.08, totalSales: 310, support: 0.281, itemVelocity: 84, marginRate: 0.70, icon: '🌿' },
  { id: 'uk13', name: 'Jumbo Bag Pink Polkadot', category: 'Bags & Storage', price: 2.08, totalSales: 295, support: 0.268, itemVelocity: 81, marginRate: 0.70, icon: '👛' },
  { id: 'uk14', name: 'Jumbo Storage Bag Strawberry', category: 'Bags & Storage', price: 2.08, totalSales: 270, support: 0.245, itemVelocity: 79, marginRate: 0.70, icon: '🍓' },
  { id: 'uk15', name: 'Lunch Bag Red Retrospot', category: 'Bags & Storage', price: 1.65, totalSales: 350, support: 0.318, itemVelocity: 90, marginRate: 0.68, icon: '🎒' },
  { id: 'uk16', name: 'Lunch Bag Pink Polkadot', category: 'Bags & Storage', price: 1.65, totalSales: 260, support: 0.236, itemVelocity: 78, marginRate: 0.68, icon: '🥪' },
  // Stationery & Craft
  { id: 'uk17', name: 'Vintage Postcard Box Set', category: 'Stationery & Craft', price: 4.50, totalSales: 230, support: 0.209, itemVelocity: 75, marginRate: 0.62, icon: '✉️' },
  { id: 'uk18', name: 'Wooden Picture Stamp Set', category: 'Stationery & Craft', price: 3.75, totalSales: 215, support: 0.195, itemVelocity: 71, marginRate: 0.60, icon: '🎨' },
  { id: 'uk19', name: 'Paper Tape Vintage Flowers 4pk', category: 'Stationery & Craft', price: 2.50, totalSales: 240, support: 0.218, itemVelocity: 77, marginRate: 0.64, icon: '📜' },
  // Candles & Fragrance
  { id: 'uk20', name: 'Lavender Scented Votive Candle', category: 'Candles', price: 1.95, totalSales: 320, support: 0.290, itemVelocity: 86, marginRate: 0.66, icon: '🕯️' },
  { id: 'uk21', name: 'French Vanilla Tin Candle', category: 'Candles', price: 3.50, totalSales: 250, support: 0.227, itemVelocity: 76, marginRate: 0.62, icon: '🕯️' },
  { id: 'uk22', name: 'Rose Petal Potpourri Jar', category: 'Candles', price: 4.95, totalSales: 175, support: 0.159, itemVelocity: 66, marginRate: 0.58, icon: '🌹' },
  // Garden & Outdoor
  { id: 'uk23', name: 'Zinc Flower Pot Cream Finish', category: 'Garden & Outdoor', price: 5.25, totalSales: 190, support: 0.172, itemVelocity: 70, marginRate: 0.54, icon: '🪴' },
  { id: 'uk24', name: 'Bird House Hanging Feeder', category: 'Garden & Outdoor', price: 8.50, totalSales: 165, support: 0.150, itemVelocity: 67, marginRate: 0.50, icon: '🐦' }
];

export function generateUKRetailTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const channels: ('Web' | 'Mobile App' | 'In-Store' | 'Marketplace')[] = ['Web', 'Web', 'Mobile App', 'In-Store'];
  const paymentMethods: ('Credit Card' | 'PayPal' | 'Apple Pay' | 'Store Credit')[] = ['Credit Card', 'PayPal', 'Credit Card', 'Apple Pay'];

  const patterns = [
    {
      core: ['Regency Teapot Roses', 'Regency Sugar Bowl Roses', 'Regency Milk Jug Roses', 'Regency Tea Cups & Saucers 4pc'],
      extras: ['Set of 3 Butterfly Cake Tins', 'Vintage Postcard Box Set'],
      weight: 240
    },
    {
      core: ['Jumbo Bag Red Retrospot', 'Jumbo Bag Pink Polkadot', 'Jumbo Bag Vintage Leaf', 'Lunch Bag Red Retrospot'],
      extras: ['Jumbo Storage Bag Strawberry', 'Lunch Bag Pink Polkadot'],
      weight: 260
    },
    {
      core: ['White Hanging Heart T-Light Holder', 'Red Hanging Heart T-Light Holder', 'Lavender Scented Votive Candle'],
      extras: ['Cream Heart Wooden Wall Plaque', 'French Vanilla Tin Candle'],
      weight: 250
    },
    {
      core: ['Vintage Postcard Box Set', 'Wooden Picture Stamp Set', 'Paper Tape Vintage Flowers 4pk'],
      extras: ['Vintage Glass Scent Bottle', 'Antique Brass Photo Frame'],
      weight: 180
    },
    {
      core: ['Zinc Flower Pot Cream Finish', 'Bird House Hanging Feeder', 'Lavender Scented Votive Candle'],
      extras: ['White Hanging Heart T-Light Holder', 'Set of 3 Butterfly Cake Tins'],
      weight: 170
    }
  ];

  let txIdCounter = 536365;
  const startDate = new Date(2026, 5, 1);

  patterns.forEach(pattern => {
    for (let i = 0; i < pattern.weight; i++) {
      const basketSet = new Set<string>();
      const shuffledCore = [...pattern.core].sort(() => 0.5 - Math.random());
      const coreCount = Math.floor(Math.random() * 3) + 2;
      shuffledCore.slice(0, coreCount).forEach(item => basketSet.add(item));

      if (Math.random() > 0.35) {
        basketSet.add(pattern.extras[Math.floor(Math.random() * pattern.extras.length)]);
      }
      if (Math.random() > 0.45) {
        basketSet.add(ukRetailProducts[Math.floor(Math.random() * ukRetailProducts.length)].name);
      }

      const basketItems = Array.from(basketSet);
      if (basketItems.length < 2) basketItems.push('White Hanging Heart T-Light Holder');

      const totalAmount = Number(basketItems.reduce((sum, itemName) => {
        const p = ukRetailProducts.find(prod => prod.name === itemName);
        return sum + (p ? p.price : 4.50);
      }, 0).toFixed(2));

      const dayOffset = Math.floor(Math.random() * 60);
      const hour = Math.floor(Math.random() * 12) + 9;
      const minute = Math.floor(Math.random() * 60);
      const txDate = new Date(startDate.getTime() + dayOffset * 86400000 + hour * 3600000 + minute * 60000);

      transactions.push({
        id: `INV-${txIdCounter++}`,
        customerId: `UK-CUST-${Math.floor(12000 + Math.random() * 5000)}`,
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
