import { Product, Transaction, DatasetMetadata } from '../../types';

export const bakeryCafeMetadata: DatasetMetadata = {
  id: 'bakery-cafe',
  name: 'Artisan Bakery & Cafe Transactions',
  description: 'Famous Kaggle Bread Basket / French Bakery Point-of-Sale dataset with fresh pastries, specialty coffee, and lunch items.',
  industry: 'Food & Beverage / Bakery POS',
  source: 'Kaggle Bakery Transaction Dataset',
  transactionCount: 950,
  productCount: 28,
  categoryCount: 5,
  avgBasketSize: 3.6,
  avgBasketValue: 16.40,
  sparsity: 0.82
};

export const bakeryCafeProducts: Product[] = [
  // Coffee & Espresso
  { id: 'b1', name: 'Artisan Espresso', category: 'Coffee & Espresso', price: 3.25, totalSales: 390, support: 0.410, itemVelocity: 95, marginRate: 0.78, icon: '☕' },
  { id: 'b2', name: 'Oat Milk Cappuccino', category: 'Coffee & Espresso', price: 4.75, totalSales: 340, support: 0.358, itemVelocity: 92, marginRate: 0.75, icon: '☕' },
  { id: 'b3', name: 'Vanilla Caramel Latte', category: 'Coffee & Espresso', price: 5.25, totalSales: 290, support: 0.305, itemVelocity: 88, marginRate: 0.72, icon: '☕' },
  { id: 'b4', name: 'Iced Cold Brew', category: 'Coffee & Espresso', price: 4.50, totalSales: 270, support: 0.284, itemVelocity: 89, marginRate: 0.76, icon: '🧊' },
  { id: 'b5', name: 'Matcha Green Tea Latte', category: 'Coffee & Espresso', price: 5.50, totalSales: 210, support: 0.221, itemVelocity: 83, marginRate: 0.70, icon: '🍵' },
  // Fresh Pastries
  { id: 'b6', name: 'Traditional French Croissant', category: 'Pastries', price: 3.50, totalSales: 410, support: 0.431, itemVelocity: 96, marginRate: 0.65, icon: '🥐' },
  { id: 'b7', name: 'Pain au Chocolat', category: 'Pastries', price: 3.95, totalSales: 360, support: 0.379, itemVelocity: 93, marginRate: 0.64, icon: '🥐' },
  { id: 'b8', name: 'Almond Flaky Croissant', category: 'Pastries', price: 4.50, totalSales: 280, support: 0.295, itemVelocity: 87, marginRate: 0.62, icon: '🥐' },
  { id: 'b9', name: 'Cinnamon Brown Sugar Roll', category: 'Pastries', price: 4.25, totalSales: 250, support: 0.263, itemVelocity: 84, marginRate: 0.60, icon: '🍥' },
  { id: 'b10', name: 'Wild Blueberry Scone', category: 'Pastries', price: 3.75, totalSales: 230, support: 0.242, itemVelocity: 80, marginRate: 0.63, icon: '🥮' },
  // Artisan Breads
  { id: 'b11', name: 'Rustic Sourdough Boule', category: 'Breads', price: 6.50, totalSales: 280, support: 0.295, itemVelocity: 85, marginRate: 0.58, icon: '🍞' },
  { id: 'b12', name: 'Classic French Baguette', category: 'Breads', price: 3.25, totalSales: 310, support: 0.326, itemVelocity: 89, marginRate: 0.60, icon: '🥖' },
  { id: 'b13', name: 'Olive & Rosemary Focaccia', category: 'Breads', price: 5.75, totalSales: 200, support: 0.210, itemVelocity: 77, marginRate: 0.55, icon: '🫓' },
  { id: 'b14', name: 'Multigrain Seeded Loaf', category: 'Breads', price: 5.95, totalSales: 180, support: 0.189, itemVelocity: 74, marginRate: 0.56, icon: '🍞' },
  // Sandwiches & Savory
  { id: 'b15', name: 'Prosciutto & Mozzarella Panini', category: 'Savory', price: 8.95, totalSales: 220, support: 0.231, itemVelocity: 82, marginRate: 0.50, icon: '🥪' },
  { id: 'b16', name: 'Smoked Salmon Cream Cheese Bagel', category: 'Savory', price: 9.50, totalSales: 195, support: 0.205, itemVelocity: 81, marginRate: 0.48, icon: '🥯' },
  { id: 'b17', name: 'Spinach & Feta Quiche Slice', category: 'Savory', price: 6.75, totalSales: 175, support: 0.184, itemVelocity: 75, marginRate: 0.52, icon: '🥧' },
  // Desserts & Sweets
  { id: 'b18', name: 'French Macarons (Box of 6)', category: 'Desserts', price: 12.00, totalSales: 160, support: 0.168, itemVelocity: 72, marginRate: 0.68, icon: '🧁' },
  { id: 'b19', name: 'Salted Caramel Eclair', category: 'Desserts', price: 4.50, totalSales: 190, support: 0.200, itemVelocity: 78, marginRate: 0.60, icon: '🍫' },
  { id: 'b20', name: 'Raspberry Tartlet', category: 'Desserts', price: 5.25, totalSales: 150, support: 0.158, itemVelocity: 70, marginRate: 0.58, icon: '🥧' }
];

export function generateBakeryTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const channels: ('Web' | 'Mobile App' | 'In-Store')[] = ['In-Store', 'In-Store', 'Mobile App', 'Web'];
  const paymentMethods: ('Credit Card' | 'Apple Pay' | 'Store Credit')[] = ['Apple Pay', 'Credit Card', 'Apple Pay'];

  const patterns = [
    {
      core: ['Traditional French Croissant', 'Artisan Espresso', 'Pain au Chocolat'],
      extras: ['Almond Flaky Croissant', 'Vanilla Caramel Latte'],
      weight: 280
    },
    {
      core: ['Oat Milk Cappuccino', 'Wild Blueberry Scone', 'Cinnamon Brown Sugar Roll'],
      extras: ['Traditional French Croissant', 'Iced Cold Brew'],
      weight: 230
    },
    {
      core: ['Classic French Baguette', 'Rustic Sourdough Boule', 'Olive & Rosemary Focaccia'],
      extras: ['Traditional French Croissant', 'Prosciutto & Mozzarella Panini'],
      weight: 190
    },
    {
      core: ['Prosciutto & Mozzarella Panini', 'Iced Cold Brew', 'Salted Caramel Eclair'],
      extras: ['Matcha Green Tea Latte', 'French Macarons (Box of 6)'],
      weight: 150
    },
    {
      core: ['Smoked Salmon Cream Cheese Bagel', 'Artisan Espresso', 'Raspberry Tartlet'],
      extras: ['Spinach & Feta Quiche Slice', 'Oat Milk Cappuccino'],
      weight: 100
    }
  ];

  let txIdCounter = 4001;
  const startDate = new Date(2026, 6, 15);

  patterns.forEach(pattern => {
    for (let i = 0; i < pattern.weight; i++) {
      const basketSet = new Set<string>();
      const shuffledCore = [...pattern.core].sort(() => 0.5 - Math.random());
      const coreCount = Math.floor(Math.random() * 2) + 2;
      shuffledCore.slice(0, coreCount).forEach(item => basketSet.add(item));

      if (Math.random() > 0.3) {
        basketSet.add(pattern.extras[Math.floor(Math.random() * pattern.extras.length)]);
      }
      if (Math.random() > 0.5) {
        basketSet.add(bakeryCafeProducts[Math.floor(Math.random() * bakeryCafeProducts.length)].name);
      }

      const basketItems = Array.from(basketSet);
      if (basketItems.length < 2) basketItems.push('Artisan Espresso');

      const totalAmount = Number(basketItems.reduce((sum, itemName) => {
        const p = bakeryCafeProducts.find(prod => prod.name === itemName);
        return sum + (p ? p.price : 4.00);
      }, 0).toFixed(2));

      const dayOffset = Math.floor(Math.random() * 30);
      const hour = (Math.random() > 0.7) ? (Math.floor(Math.random() * 4) + 12) : (Math.floor(Math.random() * 5) + 7); // morning coffee peak
      const minute = Math.floor(Math.random() * 60);
      const txDate = new Date(startDate.getTime() + dayOffset * 86400000 + hour * 3600000 + minute * 60000);

      transactions.push({
        id: `BAKE-${txIdCounter++}`,
        customerId: `GUEST-${Math.floor(100 + Math.random() * 900)}`,
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
