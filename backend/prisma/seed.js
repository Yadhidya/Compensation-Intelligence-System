const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const salaries = [
  // Google - L3
  {
    company: "google",
    companyDisplay: "Google",
    role: "Software Engineer",
    level: "L3",
    location: "Mountain View, CA",
    experienceYears: 1.5,
    baseSalary: 145000,
    bonus: 20000,
    stock: 45000,
    totalCompensation: 210000,
  },
  // Google - L4
  {
    company: "google",
    companyDisplay: "Google",
    role: "Software Engineer",
    level: "L4",
    location: "Mountain View, CA",
    experienceYears: 3,
    baseSalary: 172000,
    bonus: 25000,
    stock: 83000,
    totalCompensation: 280000,
  },
  // Google - L5
  {
    company: "google",
    companyDisplay: "Google",
    role: "Software Engineer",
    level: "L5",
    location: "Mountain View, CA",
    experienceYears: 6.5,
    baseSalary: 210000,
    bonus: 35000,
    stock: 155000,
    totalCompensation: 400000,
  },
  {
    company: "google",
    companyDisplay: "Google",
    role: "Software Engineer",
    level: "L5",
    location: "New York, NY",
    experienceYears: 7,
    baseSalary: 220000,
    bonus: 40000,
    stock: 160000,
    totalCompensation: 420000,
  },
  // Google - L6
  {
    company: "google",
    companyDisplay: "Google",
    role: "Software Engineer",
    level: "L6",
    location: "Mountain View, CA",
    experienceYears: 10,
    baseSalary: 260000,
    bonus: 60000,
    stock: 280000,
    totalCompensation: 600000,
  },
  // Meta - E3
  {
    company: "meta",
    companyDisplay: "Meta",
    role: "Software Engineer",
    level: "E3",
    location: "Menlo Park, CA",
    experienceYears: 1,
    baseSalary: 138000,
    bonus: 14000,
    stock: 58000,
    totalCompensation: 210000,
  },
  // Meta - E4
  {
    company: "meta",
    companyDisplay: "Meta",
    role: "Software Engineer",
    level: "E4",
    location: "Menlo Park, CA",
    experienceYears: 3.5,
    baseSalary: 168000,
    bonus: 20000,
    stock: 102000,
    totalCompensation: 290000,
  },
  // Meta - E5
  {
    company: "meta",
    companyDisplay: "Meta",
    role: "Software Engineer",
    level: "E5",
    location: "Menlo Park, CA",
    experienceYears: 6,
    baseSalary: 205000,
    bonus: 31000,
    stock: 164000,
    totalCompensation: 400000,
  },
  {
    company: "meta",
    companyDisplay: "Meta",
    role: "Data Scientist",
    level: "E5",
    location: "Seattle, WA",
    experienceYears: 8,
    baseSalary: 195000,
    bonus: 29000,
    stock: 146000,
    totalCompensation: 370000,
  },
  // Meta - E6
  {
    company: "meta",
    companyDisplay: "Meta",
    role: "Software Engineer",
    level: "E6",
    location: "Menlo Park, CA",
    experienceYears: 11,
    baseSalary: 255000,
    bonus: 51000,
    stock: 314000,
    totalCompensation: 620000,
  },
  // Netflix - Senior
  {
    company: "netflix",
    companyDisplay: "Netflix",
    role: "Software Engineer",
    level: "Senior",
    location: "Los Gatos, CA",
    experienceYears: 7,
    baseSalary: 510000,
    bonus: 0,
    stock: 40000,
    totalCompensation: 550000,
  },
  {
    company: "netflix",
    companyDisplay: "Netflix",
    role: "Software Engineer",
    level: "Senior",
    location: "Los Gatos, CA",
    experienceYears: 9,
    baseSalary: 550000,
    bonus: 0,
    stock: 50000,
    totalCompensation: 600000,
  },
  // Netflix - L5
  {
    company: "netflix",
    companyDisplay: "Netflix",
    role: "Software Engineer",
    level: "L5",
    location: "Los Gatos, CA",
    experienceYears: 5,
    baseSalary: 420000,
    bonus: 0,
    stock: 30000,
    totalCompensation: 450000,
  },
  // Amazon - L4
  {
    company: "amazon",
    companyDisplay: "Amazon",
    role: "Software Development Engineer I",
    level: "L4",
    location: "Seattle, WA",
    experienceYears: 1,
    baseSalary: 130000,
    bonus: 30000,
    stock: 20000,
    totalCompensation: 180000,
  },
  // Amazon - L5
  {
    company: "amazon",
    companyDisplay: "Amazon",
    role: "Software Development Engineer II",
    level: "L5",
    location: "Seattle, WA",
    experienceYears: 4,
    baseSalary: 165000,
    bonus: 45000,
    stock: 60000,
    totalCompensation: 270000,
  },
  {
    company: "amazon",
    companyDisplay: "Amazon",
    role: "Software Development Engineer II",
    level: "L5",
    location: "Austin, TX",
    experienceYears: 5,
    baseSalary: 155000,
    bonus: 35000,
    stock: 55000,
    totalCompensation: 245000,
  },
  // Amazon - L6
  {
    company: "amazon",
    companyDisplay: "Amazon",
    role: "Software Development Manager",
    level: "L6",
    location: "Seattle, WA",
    experienceYears: 9,
    baseSalary: 195000,
    bonus: 65000,
    stock: 120000,
    totalCompensation: 380000,
  },
  // Microsoft - 59
  {
    company: "microsoft",
    companyDisplay: "Microsoft",
    role: "Software Engineer",
    level: "59",
    location: "Redmond, WA",
    experienceYears: 1.5,
    baseSalary: 125000,
    bonus: 15000,
    stock: 20000,
    totalCompensation: 160000,
  },
  // Microsoft - 61
  {
    company: "microsoft",
    companyDisplay: "Microsoft",
    role: "Software Engineer",
    level: "61",
    location: "Redmond, WA",
    experienceYears: 3,
    baseSalary: 148000,
    bonus: 22000,
    stock: 35000,
    totalCompensation: 205000,
  },
  // Microsoft - 63
  {
    company: "microsoft",
    companyDisplay: "Microsoft",
    role: "Software Engineer",
    level: "63",
    location: "Redmond, WA",
    experienceYears: 6,
    baseSalary: 185000,
    bonus: 30000,
    stock: 65000,
    totalCompensation: 280000,
  },
  // Apple - ICT3
  {
    company: "apple",
    companyDisplay: "Apple",
    role: "Software Engineer",
    level: "ICT3",
    location: "Cupertino, CA",
    experienceYears: 2,
    baseSalary: 150000,
    bonus: 18000,
    stock: 42000,
    totalCompensation: 210000,
  },
  // Apple - ICT4
  {
    company: "apple",
    companyDisplay: "Apple",
    role: "Software Engineer",
    level: "ICT4",
    location: "Cupertino, CA",
    experienceYears: 4.5,
    baseSalary: 188000,
    bonus: 25000,
    stock: 97000,
    totalCompensation: 310000,
  },
];

async function main() {
  console.log('Clearing database...');
  await prisma.salary.deleteMany({});
  console.log('Inserting seed salaries...');
  for (const s of salaries) {
    await prisma.salary.create({
      data: s
    });
  }
  console.log(`Successfully seeded ${salaries.length} salary entries.`);
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
