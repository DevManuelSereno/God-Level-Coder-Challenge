import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Seed configuration
const CONFIG = {
  STORES: 50,
  PRODUCTS: 100,
  CHANNELS: 4,
  SUB_BRANDS: 3,
  CUSTOMERS: 10000,
  SALES: 50000,
  PAYMENT_TYPES: 6,
  ITEMS: 50,
  MONTHS: 6,
};

// Helper to generate random data
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number): number => Math.random() * (max - min) + min;

// Generate delivery time with normal distribution (realistic)
// Mean: 30 min (1800s), StdDev: 8 min (480s)
// Range: ~20-45 min with most deliveries around 25-35 min
const generateDeliveryTime = (): number => {
  // Box-Muller transform for normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  
  const mean = 1800; // 30 minutes in seconds
  const stdDev = 480; // 8 minutes in seconds
  const value = Math.round(mean + z * stdDev);
  
  // Clamp between 15-50 minutes (900-3000 seconds)
  return Math.max(900, Math.min(3000, value));
};

// Generate date within last 6 months
const generateDate = (): Date => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
  const randomTime = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
  return new Date(randomTime);
};

// Data generators
const generateStores = (count: number) => {
  const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Salvador', 'Brasília', 'Fortaleza'];
  const states = ['SP', 'RJ', 'MG', 'PR', 'RS', 'BA', 'DF', 'CE'];

  return Array.from({ length: count }, (_, i) => ({
    id: `store-${i + 1}`,
    name: `Loja ${i + 1}`,
    city: randomItem(cities),
    state: randomItem(states),
    isActive: true,
    isOwn: Math.random() > 0.2,
  }));
};

const generateSubBrands = (count: number) => {
  const names = ['Premium', 'Express', 'Gourmet'];
  return Array.from({ length: count }, (_, i) => ({
    id: `subbrand-${i + 1}`,
    name: names[i] || `SubBrand ${i + 1}`,
  }));
};

const generateProducts = (count: number) => {
  const names = [
    'Pizza Margherita', 'Pizza Calabresa', 'Pizza Portuguesa', 'Pizza Frango',
    'Hamburguer Classic', 'Hamburguer Bacon', 'Hamburguer Vegano',
    'Salada Caesar', 'Salada Grega', 'Salada Verde',
    'Coca-Cola', 'Pepsi', 'Suco Natural', 'Água', 'Cerveja',
    'Brownie', 'Pudim', 'Sorvete', 'Petit Gateau',
    'Batata Frita', 'Onion Rings', 'Bruschetta',
    'File Mignon', 'Salmão Grelhado', 'Frango Parmegiana',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `product-${i + 1}`,
    name: i < names.length ? names[i] : `Produto ${i + 1}`,
  }));
};

const generateItems = (count: number) => {
  const names = [
    'Queijo Extra', 'Bacon', 'Cebola Caramelizada', 'Molho Especial',
    'Alface', 'Tomate', 'Picles', 'Azeitona', 'Champignon',
    'Milho', 'Ervilha', 'Palmito', 'Catupiry',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    name: i < names.length ? names[i] : `Item ${i + 1}`,
  }));
};

const generateChannels = () => [
  { id: 'channel-1', name: 'Presencial', type: 'P' },
  { id: 'channel-2', name: 'iFood', type: 'D' },
  { id: 'channel-3', name: 'Rappi', type: 'D' },
  { id: 'channel-4', name: 'App Próprio', type: 'D' },
];

const generatePaymentTypes = () => [
  { id: 'payment-1', description: 'Cartão Crédito' },
  { id: 'payment-2', description: 'Cartão Débito' },
  { id: 'payment-3', description: 'Dinheiro' },
  { id: 'payment-4', description: 'PIX' },
  { id: 'payment-5', description: 'Vale Alimentação' },
  { id: 'payment-6', description: 'Vale Refeição' },
];

const generateCustomers = (count: number, startIndex: number = 0) => {
  const firstNames = ['João', 'Maria', 'José', 'Ana', 'Pedro', 'Carla', 'Lucas', 'Fernanda', 'Paulo', 'Julia'];
  const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Pereira', 'Rodrigues', 'Almeida', 'Lima', 'Gomes'];

  return Array.from({ length: count }, (_, i) => {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const uniqueId = startIndex + i;
    return {
      id: `customer-${uniqueId + 1}`,
      customerName: `${firstName} ${lastName}`,
      email: `customer${uniqueId}_${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phoneNumber: `+5511${randomInt(90000000, 99999999)}`,
    };
  });
};

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Clean existing data
    console.log('🧹 Cleaning existing data...');
    await prisma.itemItemProductSale.deleteMany();
    await prisma.itemProductSale.deleteMany();
    await prisma.productSale.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.deliveryAddress.deleteMany();
    await prisma.deliverySale.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.paymentType.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.channel.deleteMany();
    await prisma.subBrand.deleteMany();
    await prisma.item.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.optionGroup.deleteMany();
    await prisma.store.deleteMany();
    await prisma.dashboard.deleteMany();
    console.log('✅ Database cleaned\n');

    // Create stores
    console.log(`📍 Creating ${CONFIG.STORES} stores...`);
    const stores = await prisma.$transaction(
      generateStores(CONFIG.STORES).map(store => prisma.store.create({ data: store }))
    );
    console.log(`✅ Created ${stores.length} stores\n`);

    // Create products
    console.log(`🍕 Creating ${CONFIG.PRODUCTS} products...`);
    const products = await prisma.$transaction(
      generateProducts(CONFIG.PRODUCTS).map(product => prisma.product.create({ data: product }))
    );
    console.log(`✅ Created ${products.length} products\n`);

    // Create sub-brands
    console.log(`🏷️  Creating ${CONFIG.SUB_BRANDS} sub-brands...`);
    const subBrands = await prisma.$transaction(
      generateSubBrands(CONFIG.SUB_BRANDS).map(sb => prisma.subBrand.create({ data: sb }))
    );
    console.log(`✅ Created ${subBrands.length} sub-brands\n`);

    // Create channels
    console.log(`📱 Creating ${CONFIG.CHANNELS} channels...`);
    const channels = await prisma.$transaction(
      generateChannels().map(channel => prisma.channel.create({ data: channel }))
    );
    console.log(`✅ Created ${channels.length} channels\n`);

    // Create payment types
    console.log(`💳 Creating ${CONFIG.PAYMENT_TYPES} payment types...`);
    const paymentTypes = await prisma.$transaction(
      generatePaymentTypes().map(pt => prisma.paymentType.create({ data: pt }))
    );
    console.log(`✅ Created ${paymentTypes.length} payment types\n`);

    // Create items
    console.log(`🥓 Creating ${CONFIG.ITEMS} items...`);
    const items = await prisma.$transaction(
      generateItems(CONFIG.ITEMS).map(item => prisma.item.create({ data: item }))
    );
    console.log(`✅ Created ${items.length} items\n`);
    
    // Create option groups
    console.log(`📝 Creating option groups...`);
    await prisma.optionGroup.create({
      data: {
        id: 'option-group-1',
        name: 'Customizações',
      }
    });
    console.log(`✅ Created option group\n`);

    // Create customers
    console.log(`👥 Creating ${CONFIG.CUSTOMERS} customers...`);
    const batchSize = 1000;
    const customers: { id: string }[] = [];
    for (let i = 0; i < CONFIG.CUSTOMERS; i += batchSize) {
      const batch = generateCustomers(Math.min(batchSize, CONFIG.CUSTOMERS - i), i);
      const createdBatch = await prisma.$transaction(
        batch.map(customer => prisma.customer.create({ data: customer }))
      );
      customers.push(...createdBatch);
      console.log(`  Progress: ${customers.length}/${CONFIG.CUSTOMERS}`);
    }
    console.log(`✅ Created ${customers.length} customers\n`);

    // Create sales with related data
    console.log(`💰 Creating ${CONFIG.SALES.toLocaleString()} sales records with payments...`);
    const salesBatchSize = 1000;
    const neighborhoods = ['Centro', 'Jardins', 'Paulista', 'Vila Mariana', 'Pinheiros', 'Itaim', 'Moema', 'Ipanema', 'Copacabana', 'Leblon'];

    for (let i = 0; i < CONFIG.SALES; i += salesBatchSize) {
      const salesBatch = Array.from({ length: Math.min(salesBatchSize, CONFIG.SALES - i) }, (_, idx) => {
        const createdAt = generateDate();
        const channel = randomItem(channels);
        const isDelivery = channel.type === 'D';
        const totalAmount = randomFloat(15, 250);
        const saleId = `sale-${i + idx + 1}`;

        return {
          id: saleId,
          storeId: randomItem(stores).id,
          channelId: channel.id,
          customerId: randomItem(customers).id,
          subBrandId: Math.random() > 0.3 ? randomItem(subBrands).id : null,
          createdAt,
          totalAmount,
          deliverySeconds: isDelivery ? generateDeliveryTime() : null,
          productionSeconds: randomInt(300, 1800),
        };
      });

      // Create sales
      const createdSales = await prisma.$transaction(
        salesBatch.map(sale => prisma.sale.create({ data: sale }))
      );

      // Create product sales for each sale
      const productSalesData = createdSales.flatMap((sale) => {
        const numProducts = randomInt(1, 3);
        return Array.from({ length: numProducts }, (_, pIdx) => ({
          id: `ps-${sale.id}-${pIdx}`,
          saleId: sale.id,
          productId: randomItem(products).id,
          quantity: randomInt(1, 3),
          basePrice: randomFloat(10, 80),
          totalPrice: randomFloat(15, 100),
        }));
      });

      const createdProductSales = await prisma.$transaction(
        productSalesData.map(ps => prisma.productSale.create({ data: ps }))
      );
      
      // Create item product sales (customizations) for some product sales
      const itemProductSalesData = createdProductSales
        .filter(() => Math.random() > 0.5) // 50% of products have customizations
        .flatMap((ps) => {
          const numItems = randomInt(1, 3);
          return Array.from({ length: numItems }, (_, iIdx) => ({
            id: `ips-${ps.id}-${iIdx}`,
            productSaleId: ps.id,
            itemId: randomItem(items).id,
            optionGroupId: 'option-group-1', // We'll need to create this
            quantity: randomInt(1, 2),
            additionalPrice: randomFloat(2, 15),
            price: randomFloat(2, 20),
          }));
        });

      if (itemProductSalesData.length > 0) {
        await prisma.$transaction(
          itemProductSalesData.map(ips => prisma.itemProductSale.create({ data: ips }))
        );
      }

      // Create payments for each sale
      const paymentsData = createdSales.flatMap((sale) => {
        const numPayments = Math.random() > 0.8 ? 2 : 1; // 20% split payments
        const paymentPercentages = numPayments === 2 ? [0.6, 0.4] : [1.0];
        
        return Array.from({ length: numPayments }, (_, pIdx) => ({
          id: `payment-${sale.id}-${pIdx}`,
          saleId: sale.id,
          paymentTypeId: randomItem(paymentTypes).id,
          value: sale.totalAmount * paymentPercentages[pIdx],
          isOnline: Math.random() > 0.5,
        }));
      });

      await prisma.$transaction(
        paymentsData.map(payment => prisma.payment.create({ data: payment }))
      );

      // Create delivery addresses for delivery sales
      const deliveryAddressesData = createdSales
        .filter(sale => {
          const channel = channels.find(c => c.id === sale.channelId);
          return channel?.type === 'D';
        })
        .map(sale => ({
          id: `addr-${sale.id}`,
          saleId: sale.id,
          street: `Rua ${randomInt(1, 100)}`,
          number: `${randomInt(1, 9999)}`,
          neighborhood: randomItem(neighborhoods),
          city: randomItem(['São Paulo', 'Rio de Janeiro', 'Belo Horizonte']),
          state: randomItem(['SP', 'RJ', 'MG']),
          postalCode: `${randomInt(10000, 99999)}-${randomInt(100, 999)}`,
        }));

      if (deliveryAddressesData.length > 0) {
        await prisma.$transaction(
          deliveryAddressesData.map(addr => prisma.deliveryAddress.create({ data: addr }))
        );
      }

      console.log(`  Progress: ${Math.min(i + salesBatchSize, CONFIG.SALES).toLocaleString()}/${CONFIG.SALES.toLocaleString()}`);
    }
    console.log(`✅ Created ${CONFIG.SALES.toLocaleString()} sales with related data\n`);

    // Summary
    console.log('🎉 Database seeded successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Stores: ${stores.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Items: ${items.length}`);
    console.log(`   - Channels: ${channels.length}`);
    console.log(`   - Sub-brands: ${subBrands.length}`);
    console.log(`   - Payment Types: ${paymentTypes.length}`);
    console.log(`   - Customers: ${customers.length}`);
    console.log(`   - Sales: ${CONFIG.SALES.toLocaleString()}`);
    console.log(`   - Payments: ~${CONFIG.SALES.toLocaleString()} (1-2 per sale)`);
    console.log(`   - Product Sales: ~${(CONFIG.SALES * 1.5).toLocaleString()}`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
