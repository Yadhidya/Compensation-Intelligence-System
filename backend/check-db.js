const { PrismaClient } = require('@prisma/client');

const passwords = [
  'admin',
  'root',
  'password',
  '123456',
  'postgres',
  'postgres123',
  'Postgres@123',
  'Pg@123',
  'hp',
  'hp123',
  'hp@123',
  'admin123',
  '' // blank
];

async function testPassword(pwd) {
  const url = `postgresql://postgres:${encodeURIComponent(pwd)}@localhost:5433/compensation_db?schema=public`;
  const prisma = new PrismaClient({
    datasources: {
      db: { url }
    }
  });

  try {
    // Try a simple query
    await prisma.$queryRaw`SELECT 1`;
    console.log(`\n>>> SUCCESS! Password is: "${pwd}"`);
    console.log(`URL: ${url}\n`);
    await prisma.$disconnect();
    return true;
  } catch (error) {
    // Print failure reasons to help diagnose
    process.stdout.write('.');
    await prisma.$disconnect();
    return false;
  }
}

async function run() {
  console.log('Testing passwords against localhost:5433...');
  for (const pwd of passwords) {
    const success = await testPassword(pwd);
    if (success) {
      process.exit(0);
    }
  }
  console.log('\nAll attempted passwords failed.');
  process.exit(1);
}

run();
