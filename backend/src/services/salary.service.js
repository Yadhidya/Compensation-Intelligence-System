const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Normalizes company names to lowercase and trimmed spaces
 */
const normalizeCompany = (name) => {
  return name.trim().toLowerCase();
};

/**
 * Calculates the median of an array of numbers
 */
const calculateMedian = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[middle];
  }
  return (sorted[middle - 1] + sorted[middle]) / 2;
};

/**
 * Ingests a new salary entry, checking for duplicates
 */
const ingestSalary = async (data) => {
  const normalizedCompany = normalizeCompany(data.company);
  const companyDisplay = data.company.trim();
  const roleNormalized = data.role.trim();
  const levelNormalized = data.level.trim();
  const locationNormalized = data.location.trim();
  const bonusVal = data.bonus ?? 0;
  const stockVal = data.stock ?? 0;
  const totalComp = data.baseSalary + bonusVal + stockVal;

  // Deduplication check: look for exact same submission
  const existing = await prisma.salary.findFirst({
    where: {
      company: normalizedCompany,
      role: { equals: roleNormalized, mode: 'insensitive' },
      level: { equals: levelNormalized, mode: 'insensitive' },
      location: { equals: locationNormalized, mode: 'insensitive' },
      experienceYears: data.experienceYears,
      baseSalary: data.baseSalary,
      bonus: bonusVal,
      stock: stockVal,
    },
  });

  if (existing) {
    // Return existing record (duplicate gracefully handled)
    return { data: existing, isDuplicate: true };
  }

  // Create new record
  const newSalary = await prisma.salary.create({
    data: {
      company: normalizedCompany,
      companyDisplay,
      role: roleNormalized,
      level: levelNormalized,
      location: locationNormalized,
      experienceYears: data.experienceYears,
      baseSalary: data.baseSalary,
      bonus: bonusVal,
      stock: stockVal,
      totalCompensation: totalComp,
      confidenceScore: 1.0, // Default baseline
    },
  });

  return { data: newSalary, isDuplicate: false };
};

/**
 * Gets paginated and filtered salaries
 */
const getSalaries = async (filters) => {
  const { company, role, level, location, sortBy, sortOrder, page, limit } = filters;
  const skip = (page - 1) * limit;

  const where = {};

  if (company) {
    where.company = normalizeCompany(company);
  }
  if (role) {
    where.role = { contains: role.trim(), mode: 'insensitive' };
  }
  if (level) {
    where.level = { contains: level.trim(), mode: 'insensitive' };
  }
  if (location) {
    where.location = { contains: location.trim(), mode: 'insensitive' };
  }

  const orderBy = {};
  if (sortBy === 'total_compensation') {
    orderBy.totalCompensation = sortOrder;
  } else if (sortBy === 'experience_years') {
    orderBy.experienceYears = sortOrder;
  } else {
    orderBy.createdAt = sortOrder;
  }

  const [items, total] = await prisma.$transaction([
    prisma.salary.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.salary.count({ where }),
  ]);

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Aggregates salaries and compiles analytics for a specific company
 */
const getCompanyData = async (companyName) => {
  const normalizedCompany = normalizeCompany(companyName);

  const salaries = await prisma.salary.findMany({
    where: { company: normalizedCompany },
    orderBy: { totalCompensation: 'desc' },
  });

  if (salaries.length === 0) {
    return null;
  }

  // Calculate statistics
  const baseSalaries = salaries.map(s => s.baseSalary);
  const bonuses = salaries.map(s => s.bonus);
  const stocks = salaries.map(s => s.stock);
  const totalComps = salaries.map(s => s.totalCompensation);

  const medianBase = calculateMedian(baseSalaries);
  const medianBonus = calculateMedian(bonuses);
  const medianStock = calculateMedian(stocks);
  const medianTotalComp = calculateMedian(totalComps);

  // Group by level
  const levelMap = {};
  salaries.forEach(s => {
    const levelKey = s.level.toUpperCase();
    if (!levelMap[levelKey]) {
      levelMap[levelKey] = {
        level: s.level,
        count: 0,
        totalComps: [],
      };
    }
    levelMap[levelKey].count += 1;
    levelMap[levelKey].totalComps.push(s.totalCompensation);
  });

  const levelDistribution = Object.values(levelMap).map(l => ({
    level: l.level,
    count: l.count,
    medianTotalCompensation: calculateMedian(l.totalComps),
  })).sort((a, b) => b.medianTotalCompensation - a.medianTotalCompensation);

  return {
    companyName: salaries[0].companyDisplay,
    totalSubmissions: salaries.length,
    statistics: {
      medianBaseSalary: medianBase,
      medianBonus: medianBonus,
      medianStock: medianStock,
      medianTotalCompensation: medianTotalComp,
      minTotalCompensation: Math.min(...totalComps),
      maxTotalCompensation: Math.max(...totalComps),
    },
    levelDistribution,
    salaries: salaries.slice(0, 50), // Send top 50 recent/highest salaries for visualization
  };
};

/**
 * Compares two salary records by ID side-by-side
 */
const compareSalaries = async (id1, id2) => {
  const salary1 = await prisma.salary.findUnique({ where: { id: id1 } });
  const salary2 = await prisma.salary.findUnique({ where: { id: id2 } });

  if (!salary1 || !salary2) {
    return null;
  }

  const computeDelta = (val1, val2) => {
    const diff = val1 - val2;
    const percent = val2 !== 0 ? (diff / val2) * 100 : 0;
    return {
      difference: diff,
      percentage: Number(percent.toFixed(2)),
    };
  };

  return {
    salary1: {
      id: salary1.id,
      company: salary1.companyDisplay,
      role: salary1.role,
      level: salary1.level,
      location: salary1.location,
      experienceYears: salary1.experienceYears,
      baseSalary: salary1.baseSalary,
      bonus: salary1.bonus,
      stock: salary1.stock,
      totalCompensation: salary1.totalCompensation,
    },
    salary2: {
      id: salary2.id,
      company: salary2.companyDisplay,
      role: salary2.role,
      level: salary2.level,
      location: salary2.location,
      experienceYears: salary2.experienceYears,
      baseSalary: salary2.baseSalary,
      bonus: salary2.bonus,
      stock: salary2.stock,
      totalCompensation: salary2.totalCompensation,
    },
    deltas: {
      baseSalary: computeDelta(salary1.baseSalary, salary2.baseSalary),
      bonus: computeDelta(salary1.bonus, salary2.bonus),
      stock: computeDelta(salary1.stock, salary2.stock),
      totalCompensation: computeDelta(salary1.totalCompensation, salary2.totalCompensation),
      experienceYears: salary1.experienceYears - salary2.experienceYears,
    },
  };
};

module.exports = {
  ingestSalary,
  getSalaries,
  getCompanyData,
  compareSalaries,
};
