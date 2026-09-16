import { Product, Transaction, DatasetMetadata } from '../../types';

export const instacartMetadata: DatasetMetadata = {
  id: 'instacart-groceries',
  name: 'Instacart E-Commerce Grocery Market Basket',
  description: 'Real-world anonymized basket data from 1,200+ grocery transactions across Organic Produce, Dairy, Bakery, Pantry, and Beverages.',
  industry: 'Grocery / Supermarket',
  source: 'Kaggle Instacart Market Basket Analysis Challenge',
  transactionCount: 1250,
  productCount: 42,
  categoryCount: 7,
  avgBasketSize: 4.8,
  avgBasketValue: 28.65,
  sparsity: 0.885
};

export const instacartProducts: Product[] = [
  // Produce
  { id: 'p1', name: 'Organic Bananas', category: 'Produce', price: 1.99, totalSales: 485, support: 0.388, itemVelocity: 94, marginRate: 0.35, icon: '🍌' },
  { id: 'p2', name: 'Organic Strawberries', category: 'Produce', price: 4.49, totalSales: 340, support: 0.272, itemVelocity: 88, marginRate: 0.42, icon: '🍓' },
  { id: 'p3', name: 'Organic Baby Spinach', category: 'Produce', price: 3.29, totalSales: 310, support: 0.248, itemVelocity: 82, marginRate: 0.45, icon: '🥬' },
  { id: 'p4', name: 'Organic Hass Avocado', category: 'Produce', price: 2.49, totalSales: 390, support: 0.312, itemVelocity: 91, marginRate: 0.40, icon: '🥑' },
  { id: 'p5', name: 'Organic Blueberries', category: 'Produce', price: 4.99, totalSales: 245, support: 0.196, itemVelocity: 79, marginRate: 0.48, icon: '🫐' },
  { id: 'p6', name: 'Organic Whole Milk', category: 'Dairy & Eggs', price: 4.29, totalSales: 410, support: 0.328, itemVelocity: 93, marginRate: 0.30, icon: '🥛' },
  { id: 'p7', name: 'Organic Large Grade A Eggs', category: 'Dairy & Eggs', price: 4.79, totalSales: 375, support: 0.300, itemVelocity: 89, marginRate: 0.32, icon: '🥚' },
  { id: 'p8', name: 'Salted Butter', category: 'Dairy & Eggs', price: 3.99, totalSales: 290, support: 0.232, itemVelocity: 76, marginRate: 0.38, icon: '🧈' },
  { id: 'p9', name: 'Greek Plain Yogurt', category: 'Dairy & Eggs', price: 5.49, totalSales: 260, support: 0.208, itemVelocity: 81, marginRate: 0.44, icon: '🥣' },
  { id: 'p10', name: 'Sharp Cheddar Cheese Block', category: 'Dairy & Eggs', price: 4.19, totalSales: 230, support: 0.184, itemVelocity: 73, marginRate: 0.40, icon: '🧀' },
  // Bakery
  { id: 'p11', name: 'Artisan Sourdough Bread', category: 'Bakery', price: 4.99, totalSales: 360, support: 0.288, itemVelocity: 86, marginRate: 0.52, icon: '🍞' },
  { id: 'p12', name: '100% Whole Wheat Bread', category: 'Bakery', price: 3.79, totalSales: 280, support: 0.224, itemVelocity: 78, marginRate: 0.48, icon: '🍞' },
  { id: 'p13', name: 'Butter Croissants (4-Pack)', category: 'Bakery', price: 5.99, totalSales: 210, support: 0.168, itemVelocity: 75, marginRate: 0.55, icon: '🥐' },
  { id: 'p14', name: 'Plain Bagels (6-Pack)', category: 'Bakery', price: 3.99, totalSales: 220, support: 0.176, itemVelocity: 72, marginRate: 0.50, icon: '🥯' },
  { id: 'p15', name: 'Blueberry Muffins (4-Pack)', category: 'Bakery', price: 4.49, totalSales: 180, support: 0.144, itemVelocity: 68, marginRate: 0.54, icon: '🧁' },
  // Pantry
  { id: 'p16', name: 'Extra Virgin Olive Oil', category: 'Pantry', price: 9.99, totalSales: 195, support: 0.156, itemVelocity: 70, marginRate: 0.45, icon: '🫒' },
  { id: 'p17', name: 'Organic Peanut Butter', category: 'Pantry', price: 4.99, totalSales: 250, support: 0.200, itemVelocity: 80, marginRate: 0.42, icon: '🥜' },
  { id: 'p18', name: 'Organic Strawberry Jam', category: 'Pantry', price: 3.89, totalSales: 215, support: 0.172, itemVelocity: 74, marginRate: 0.46, icon: '🍓' },
  { id: 'p19', name: 'Raw Wildflower Honey', category: 'Pantry', price: 7.49, totalSales: 165, support: 0.132, itemVelocity: 66, marginRate: 0.50, icon: '🍯' },
  { id: 'p20', name: 'Organic Marinara Pasta Sauce', category: 'Pantry', price: 3.99, totalSales: 240, support: 0.192, itemVelocity: 77, marginRate: 0.44, icon: '🥫' },
  { id: 'p21', name: 'Italian Spaghetti Pasta', category: 'Pantry', price: 2.29, totalSales: 260, support: 0.208, itemVelocity: 80, marginRate: 0.40, icon: '🍝' },
  { id: 'p22', name: 'Grated Parmesan Cheese', category: 'Pantry', price: 4.69, totalSales: 205, support: 0.164, itemVelocity: 73, marginRate: 0.45, icon: '🧀' },
  // Beverages
  { id: 'p23', name: 'Fresh Squeezed Orange Juice', category: 'Beverages', price: 4.99, totalSales: 275, support: 0.220, itemVelocity: 84, marginRate: 0.38, icon: '🍊' },
  { id: 'p24', name: 'Cold Brew Coffee Concentrate', category: 'Beverages', price: 6.99, totalSales: 235, support: 0.188, itemVelocity: 87, marginRate: 0.52, icon: '☕' },
  { id: 'p25', name: 'Sparkling Mineral Water (8-pk)', category: 'Beverages', price: 5.49, totalSales: 290, support: 0.232, itemVelocity: 83, marginRate: 0.46, icon: '💧' },
  { id: 'p26', name: 'Almond Milk Unsweetened', category: 'Beverages', price: 3.49, totalSales: 220, support: 0.176, itemVelocity: 75, marginRate: 0.36, icon: '🥛' },
  { id: 'p27', name: 'Organic Green Tea (20 bags)', category: 'Beverages', price: 4.29, totalSales: 160, support: 0.128, itemVelocity: 65, marginRate: 0.55, icon: '🍵' },
  // Snacks
  { id: 'p28', name: 'Sea Salt Tortilla Chips', category: 'Snacks', price: 3.99, totalSales: 285, support: 0.228, itemVelocity: 85, marginRate: 0.48, icon: '🌮' },
  { id: 'p29', name: 'Mild Chunky Salsa', category: 'Snacks', price: 3.29, totalSales: 260, support: 0.208, itemVelocity: 82, marginRate: 0.50, icon: '🥫' },
  { id: 'p30', name: 'Organic Guacamole Cup', category: 'Snacks', price: 4.49, totalSales: 245, support: 0.196, itemVelocity: 84, marginRate: 0.46, icon: '🥑' },
  { id: 'p31', name: 'Roasted Salted Almonds', category: 'Snacks', price: 7.99, totalSales: 175, support: 0.140, itemVelocity: 71, marginRate: 0.45, icon: '🥜' },
  { id: 'p32', name: 'Dark Chocolate Sea Salt Bar', category: 'Snacks', price: 3.49, totalSales: 195, support: 0.156, itemVelocity: 77, marginRate: 0.58, icon: '🍫' },
  // Meat & Seafood
  { id: 'p33', name: 'Organic Boneless Chicken Breast', category: 'Meat & Seafood', price: 9.99, totalSales: 250, support: 0.200, itemVelocity: 85, marginRate: 0.32, icon: '🍗' },
  { id: 'p34', name: 'Atlantic Salmon Fillet', category: 'Meat & Seafood', price: 12.99, totalSales: 180, support: 0.144, itemVelocity: 79, marginRate: 0.36, icon: '🐟' },
  { id: 'p35', name: 'Applewood Smoked Bacon', category: 'Meat & Seafood', price: 6.99, totalSales: 270, support: 0.216, itemVelocity: 88, marginRate: 0.40, icon: '🥓' },
  { id: 'p36', name: 'Ground Angus Beef 85/15', category: 'Meat & Seafood', price: 7.49, totalSales: 215, support: 0.172, itemVelocity: 78, marginRate: 0.34, icon: '🥩' },
  // Frozen & Deli
  { id: 'p37', name: 'Frozen Organic Mixed Berries', category: 'Frozen', price: 6.49, totalSales: 190, support: 0.152, itemVelocity: 74, marginRate: 0.42, icon: '🫐' },
  { id: 'p38', name: 'Vanilla Bean Ice Cream', category: 'Frozen', price: 5.99, totalSales: 210, support: 0.168, itemVelocity: 76, marginRate: 0.46, icon: '🍨' },
  { id: 'p39', name: 'Organic Hummus Classic', category: 'Deli', price: 3.99, totalSales: 225, support: 0.180, itemVelocity: 79, marginRate: 0.48, icon: '🧆' },
  { id: 'p40', name: 'Pita Bread Pocket Rounds', category: 'Deli', price: 2.99, totalSales: 205, support: 0.164, itemVelocity: 76, marginRate: 0.52, icon: '🫓' },
  { id: 'p41', name: 'Organic Gala Apples (3 lb)', category: 'Produce', price: 4.99, totalSales: 260, support: 0.208, itemVelocity: 80, marginRate: 0.38, icon: '🍎' },
  { id: 'p42', name: 'Organic Brown Jasmine Rice', category: 'Pantry', price: 3.99, totalSales: 185, support: 0.148, itemVelocity: 70, marginRate: 0.44, icon: '🍚' }
];

// Helper to generate realistic market basket transactions with strong affinity clusters
export function generateInstacartTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const channels: ('Web' | 'Mobile App' | 'In-Store' | 'Marketplace')[] = ['Web', 'Mobile App', 'Web', 'Mobile App', 'Marketplace'];
  const paymentMethods: ('Credit Card' | 'PayPal' | 'Apple Pay' | 'Store Credit')[] = ['Credit Card', 'Apple Pay', 'Credit Card', 'PayPal'];

  // Co-purchase Archetype Patterns (Clusters):
  // 1. Breakfast Classic: Eggs + Milk + Bread + Bacon + Orange Juice + Butter
  // 2. PB&J / Bakery: Bread + Peanut Butter + Strawberry Jam + Bananas + Milk
  // 3. Italian Pasta Night: Spaghetti + Marinara Sauce + Parmesan + Olive Oil + Ground Beef
  // 4. Mexican Fiesta: Tortilla Chips + Salsa + Guacamole + Hass Avocado
  // 5. Healthy Morning Smoothie: Bananas + Strawberries + Blueberries + Greek Yogurt + Baby Spinach
  // 6. Deli & Mediterranean: Hummus + Pita Bread + Baby Spinach + Olive Oil
  // 7. Weekend Brunch / Coffee: Butter Croissants + Cold Brew Coffee + Whole Milk + Blueberries

  const patterns = [
    {
      core: ['Organic Large Grade A Eggs', 'Organic Whole Milk', 'Artisan Sourdough Bread', 'Applewood Smoked Bacon', 'Fresh Squeezed Orange Juice'],
      extras: ['Salted Butter', 'Organic Bananas', 'Organic Hass Avocado'],
      weight: 220
    },
    {
      core: ['100% Whole Wheat Bread', 'Organic Peanut Butter', 'Organic Strawberry Jam', 'Organic Bananas'],
      extras: ['Organic Whole Milk', 'Organic Gala Apples (3 lb)', 'Organic Blueberries'],
      weight: 180
    },
    {
      core: ['Italian Spaghetti Pasta', 'Organic Marinara Pasta Sauce', 'Grated Parmesan Cheese', 'Extra Virgin Olive Oil'],
      extras: ['Ground Angus Beef 85/15', 'Artisan Sourdough Bread', 'Organic Baby Spinach'],
      weight: 190
    },
    {
      core: ['Sea Salt Tortilla Chips', 'Mild Chunky Salsa', 'Organic Guacamole Cup', 'Organic Hass Avocado'],
      extras: ['Organic Bananas', 'Sparkling Mineral Water (8-pk)', 'Sharp Cheddar Cheese Block'],
      weight: 200
    },
    {
      core: ['Organic Bananas', 'Organic Strawberries', 'Organic Blueberries', 'Greek Plain Yogurt', 'Organic Baby Spinach'],
      extras: ['Almond Milk Unsweetened', 'Raw Wildflower Honey', 'Frozen Organic Mixed Berries'],
      weight: 190
    },
    {
      core: ['Organic Hummus Classic', 'Pita Bread Pocket Rounds', 'Organic Baby Spinach', 'Extra Virgin Olive Oil'],
      extras: ['Organic Hass Avocado', 'Sparkling Mineral Water (8-pk)', 'Roasted Salted Almonds'],
      weight: 140
    },
    {
      core: ['Butter Croissants (4-Pack)', 'Cold Brew Coffee Concentrate', 'Organic Whole Milk', 'Organic Strawberries'],
      extras: ['Vanilla Bean Ice Cream', 'Dark Chocolate Sea Salt Bar', 'Organic Green Tea (20 bags)'],
      weight: 130
    }
  ];

  let txIdCounter = 10001;
  const startDate = new Date(2026, 6, 1);

  patterns.forEach((pattern, pIdx) => {
    for (let i = 0; i < pattern.weight; i++) {
      const basketSet = new Set<string>();

      // Add 2 to 4 core items from this pattern
      const shuffledCore = [...pattern.core].sort(() => 0.5 - Math.random());
      const coreCount = Math.floor(Math.random() * 3) + 2;
      shuffledCore.slice(0, coreCount).forEach(item => basketSet.add(item));

      // Add 1 to 2 extras
      if (Math.random() > 0.3) {
        const extra = pattern.extras[Math.floor(Math.random() * pattern.extras.length)];
        basketSet.add(extra);
      }

      // Add 1 random general item (noise & organic diversity)
      if (Math.random() > 0.4) {
        const randomItem = instacartProducts[Math.floor(Math.random() * instacartProducts.length)].name;
        basketSet.add(randomItem);
      }

      const basketItems = Array.from(basketSet);
      if (basketItems.length < 2) {
        basketItems.push('Organic Bananas');
      }

      // Calculate total amount
      const totalAmount = Number(basketItems.reduce((sum, itemName) => {
        const p = instacartProducts.find(prod => prod.name === itemName);
        return sum + (p ? p.price : 3.99);
      }, 0).toFixed(2));

      // Timestamp distribution across days & hours
      const dayOffset = Math.floor(Math.random() * 45);
      const hour = (Math.random() > 0.6) ? (Math.floor(Math.random() * 5) + 16) : (Math.floor(Math.random() * 7) + 8); // Peak around 8-15 and 16-21
      const minute = Math.floor(Math.random() * 60);
      const txDate = new Date(startDate.getTime() + dayOffset * 86400000 + hour * 3600000 + minute * 60000);

      transactions.push({
        id: `TX-INSTA-${txIdCounter++}`,
        customerId: `CUST-${Math.floor(1000 + Math.random() * 900)}`,
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
