import { Product, Transaction, DatasetMetadata } from '../../types';

export const electronicsMetadata: DatasetMetadata = {
  id: 'electronics-tech',
  name: 'Consumer Electronics & Peripherals',
  description: 'E-Commerce transactions of computing devices, accessories, gaming peripherals, and cables with high bundling potential.',
  industry: 'Electronics / Tech Accessories',
  source: 'Kaggle Tech Hardware Retail Data',
  transactionCount: 850,
  productCount: 26,
  categoryCount: 5,
  avgBasketSize: 3.4,
  avgBasketValue: 148.50,
  sparsity: 0.87
};

export const electronicsProducts: Product[] = [
  // Laptops & Tablets
  { id: 'e1', name: 'Ultra-Slim 14" Pro Laptop', category: 'Computing', price: 899.00, totalSales: 180, support: 0.211, itemVelocity: 88, marginRate: 0.18, icon: '💻' },
  { id: 'e2', name: '11" Tablet with Stylus Pen', category: 'Computing', price: 449.00, totalSales: 160, support: 0.188, itemVelocity: 82, marginRate: 0.22, icon: '📱' },
  // Peripherals
  { id: 'e3', name: 'Ergonomic Wireless Mouse', category: 'Peripherals', price: 49.99, totalSales: 340, support: 0.400, itemVelocity: 94, marginRate: 0.55, icon: '🖱️' },
  { id: 'e4', name: 'RGB Mechanical Keyboard', category: 'Peripherals', price: 89.99, totalSales: 290, support: 0.341, itemVelocity: 90, marginRate: 0.52, icon: '⌨️' },
  { id: 'e5', name: 'Desk Extended Gaming Mousepad', category: 'Peripherals', price: 19.99, totalSales: 310, support: 0.364, itemVelocity: 91, marginRate: 0.65, icon: '⬛' },
  { id: 'e6', name: '4K USB-C Web Camera with Mic', category: 'Peripherals', price: 79.99, totalSales: 210, support: 0.247, itemVelocity: 81, marginRate: 0.48, icon: '📷' },
  // Cables & Hubs
  { id: 'e7', name: '7-in-1 USB-C Multiport Hub', category: 'Accessories', price: 39.99, totalSales: 380, support: 0.447, itemVelocity: 96, marginRate: 0.62, icon: '🔌' },
  { id: 'e8', name: 'Braided 4K HDMI Cable 6ft', category: 'Accessories', price: 12.99, totalSales: 350, support: 0.411, itemVelocity: 93, marginRate: 0.70, icon: '🔌' },
  { id: 'e9', name: '100W GaN Fast Charger Block', category: 'Accessories', price: 45.99, totalSales: 270, support: 0.317, itemVelocity: 89, marginRate: 0.58, icon: '🔋' },
  { id: 'e10', name: 'Braided USB-C to USB-C Cable 2pk', category: 'Accessories', price: 14.99, totalSales: 320, support: 0.376, itemVelocity: 92, marginRate: 0.72, icon: '🔌' },
  // Audio & Gaming
  { id: 'e11', name: 'Noise-Cancelling Wireless Headphones', category: 'Audio', price: 199.99, totalSales: 240, support: 0.282, itemVelocity: 87, marginRate: 0.42, icon: '🎧' },
  { id: 'e12', name: 'True Wireless Earbuds with ANC', category: 'Audio', price: 99.99, totalSales: 260, support: 0.305, itemVelocity: 89, marginRate: 0.45, icon: '🎧' },
  { id: 'e13', name: 'Desktop Stereo Soundbar', category: 'Audio', price: 59.99, totalSales: 190, support: 0.223, itemVelocity: 79, marginRate: 0.50, icon: '🔊' },
  // Displays & Mounts
  { id: 'e14', name: '27" QHD 144Hz IPS Monitor', category: 'Displays', price: 249.99, totalSales: 175, support: 0.205, itemVelocity: 85, marginRate: 0.25, icon: '🖥️' },
  { id: 'e15', name: 'Heavy Duty Single Monitor Arm Mount', category: 'Displays', price: 39.99, totalSales: 165, support: 0.194, itemVelocity: 80, marginRate: 0.58, icon: '🦾' },
  { id: 'e16', name: 'Adjustable Aluminum Laptop Stand', category: 'Accessories', price: 29.99, totalSales: 300, support: 0.352, itemVelocity: 91, marginRate: 0.60, icon: '📐' }
];

export function generateElectronicsTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const channels: ('Web' | 'Mobile App' | 'In-Store')[] = ['Web', 'Web', 'Mobile App'];
  const paymentMethods: ('Credit Card' | 'PayPal' | 'Apple Pay')[] = ['Credit Card', 'PayPal', 'Apple Pay'];

  const patterns = [
    {
      core: ['Ultra-Slim 14" Pro Laptop', '7-in-1 USB-C Multiport Hub', 'Adjustable Aluminum Laptop Stand', '100W GaN Fast Charger Block'],
      extras: ['Braided USB-C to USB-C Cable 2pk', 'Ergonomic Wireless Mouse'],
      weight: 230
    },
    {
      core: ['RGB Mechanical Keyboard', 'Ergonomic Wireless Mouse', 'Desk Extended Gaming Mousepad'],
      extras: ['Noise-Cancelling Wireless Headphones', 'Braided 4K HDMI Cable 6ft'],
      weight: 250
    },
    {
      core: ['27" QHD 144Hz IPS Monitor', 'Heavy Duty Single Monitor Arm Mount', 'Braided 4K HDMI Cable 6ft'],
      extras: ['Desktop Stereo Soundbar', '7-in-1 USB-C Multiport Hub'],
      weight: 200
    },
    {
      core: ['11" Tablet with Stylus Pen', 'True Wireless Earbuds with ANC', '100W GaN Fast Charger Block'],
      extras: ['Adjustable Aluminum Laptop Stand', 'Braided USB-C to USB-C Cable 2pk'],
      weight: 170
    }
  ];

  let txIdCounter = 7001;
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
        basketSet.add(electronicsProducts[Math.floor(Math.random() * electronicsProducts.length)].name);
      }

      const basketItems = Array.from(basketSet);
      if (basketItems.length < 2) basketItems.push('Ergonomic Wireless Mouse');

      const totalAmount = Number(basketItems.reduce((sum, itemName) => {
        const p = electronicsProducts.find(prod => prod.name === itemName);
        return sum + (p ? p.price : 29.99);
      }, 0).toFixed(2));

      const dayOffset = Math.floor(Math.random() * 45);
      const hour = Math.floor(Math.random() * 14) + 8;
      const minute = Math.floor(Math.random() * 60);
      const txDate = new Date(startDate.getTime() + dayOffset * 86400000 + hour * 3600000 + minute * 60000);

      transactions.push({
        id: `TECH-${txIdCounter++}`,
        customerId: `TECH-CUST-${Math.floor(1000 + Math.random() * 900)}`,
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
