import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDeliveryData() {
  console.log('🔍 Checking delivery data...\n');

  // Check delivery seconds statistics
  const stats = await prisma.$queryRaw<Array<{
    count: bigint;
    min: number;
    max: number;
    avg: number;
    min_minutes: number;
    max_minutes: number;
    avg_minutes: number;
  }>>`
    SELECT 
      COUNT(*) as count,
      MIN("deliverySeconds") as min,
      MAX("deliverySeconds") as max,
      AVG("deliverySeconds") as avg,
      MIN("deliverySeconds" / 60.0) as min_minutes,
      MAX("deliverySeconds" / 60.0) as max_minutes,
      AVG("deliverySeconds" / 60.0) as avg_minutes
    FROM sales
    WHERE "deliverySeconds" IS NOT NULL
  `;

  console.log('📊 Delivery Statistics:');
  console.log('  Total deliveries:', stats[0].count.toString());
  console.log('  Min seconds:', stats[0].min);
  console.log('  Max seconds:', stats[0].max);
  console.log('  Avg seconds:', stats[0].avg);
  console.log('  Min minutes:', stats[0].min_minutes);
  console.log('  Max minutes:', stats[0].max_minutes);
  console.log('  Avg minutes:', stats[0].avg_minutes);
  console.log();

  // Check if there are any outliers
  const outliers = await prisma.$queryRaw<Array<{
    id: string;
    deliverySeconds: number;
    deliveryMinutes: number;
  }>>`
    SELECT 
      id,
      "deliverySeconds",
      "deliverySeconds" / 60.0 as "deliveryMinutes"
    FROM sales
    WHERE "deliverySeconds" > 10000
    ORDER BY "deliverySeconds" DESC
    LIMIT 10
  `;

  if (outliers.length > 0) {
    console.log('⚠️  Found outliers (delivery > 166 minutes):');
    outliers.forEach(o => {
      console.log(`  Sale ${o.id}: ${o.deliverySeconds}s (${o.deliveryMinutes.toFixed(2)} min)`);
    });
  } else {
    console.log('✅ No outliers found');
  }

  await prisma.$disconnect();
}

checkDeliveryData().catch(console.error);
