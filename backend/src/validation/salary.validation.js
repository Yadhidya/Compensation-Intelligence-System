const { z } = require('zod');

const ingestSalarySchema = z.object({
  company: z.string().trim().min(1, { message: "Company name is required" }),
  role: z.string().trim().min(1, { message: "Role is required" }),
  level: z.string().trim().min(1, { message: "Level is required" }),
  location: z.string().trim().min(1, { message: "Location is required" }),
  experienceYears: z.number({ invalid_type_error: "Experience years must be a number" })
    .min(0, { message: "Experience years cannot be negative" }),
  baseSalary: z.number({ invalid_type_error: "Base salary must be a number" })
    .min(0, { message: "Base salary cannot be negative" }),
  bonus: z.number({ invalid_type_error: "Bonus must be a number" })
    .min(0, { message: "Bonus cannot be negative" })
    .optional()
    .default(0),
  stock: z.number({ invalid_type_error: "Stock must be a number" })
    .min(0, { message: "Stock cannot be negative" })
    .optional()
    .default(0),
});

const querySalariesSchema = z.object({
  company: z.string().optional(),
  role: z.string().optional(),
  level: z.string().optional(),
  location: z.string().optional(),
  sortBy: z.enum(['total_compensation', 'experience_years', 'created_at']).optional().default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
});

module.exports = {
  ingestSalarySchema,
  querySalariesSchema,
};
