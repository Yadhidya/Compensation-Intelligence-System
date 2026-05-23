const salaryService = require('../services/salary.service');
const { ingestSalarySchema, querySalariesSchema } = require('../validation/salary.validation');

/**
 * Endpoint to add a salary entry (POST /api/ingest-salary)
 */
const ingestSalaryController = async (req, res, next) => {
  try {
    // Validate request body using Zod
    const validationResult = ingestSalarySchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: validationResult.error.flatten().fieldErrors,
      });
    }

    const { data, isDuplicate } = await salaryService.ingestSalary(validationResult.data);

    return res.status(isDuplicate ? 200 : 201).json({
      success: true,
      message: isDuplicate ? "Duplicate entry detected. Returned existing record." : "Salary data successfully ingested.",
      isDuplicate,
      data,
    });
  } catch (error) {
    console.error("Error in ingestSalaryController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during salary ingestion.",
      error: error.message,
    });
  }
};

/**
 * Endpoint to fetch, filter, and sort salary lists (GET /api/salaries)
 */
const getSalariesController = async (req, res, next) => {
  try {
    // Validate queries using Zod
    const validationResult = querySalariesSchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: validationResult.error.flatten().fieldErrors,
      });
    }

    const result = await salaryService.getSalaries(validationResult.data);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error in getSalariesController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching salaries.",
      error: error.message,
    });
  }
};

/**
 * Endpoint to fetch aggregation & metrics for a specific company (GET /api/company/:company)
 */
const getCompanyController = async (req, res, next) => {
  try {
    const { company } = req.params;
    if (!company || company.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Company name parameter is required",
      });
    }

    const data = await salaryService.getCompanyData(company);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: `No salary records found for company: "${company}"`,
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in getCompanyController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching company analytics.",
      error: error.message,
    });
  }
};

/**
 * Endpoint to compare two salaries by ID side-by-side (GET /api/compare)
 */
const compareController = async (req, res, next) => {
  try {
    const { id1, id2 } = req.query;

    if (!id1 || !id2) {
      return res.status(400).json({
        success: false,
        message: "Both 'id1' and 'id2' query parameters are required for comparison.",
      });
    }

    const comparison = await salaryService.compareSalaries(id1, id2);

    if (!comparison) {
      return res.status(404).json({
        success: false,
        message: "One or both of the provided salary records could not be found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error("Error in compareController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while comparing salary records.",
      error: error.message,
    });
  }
};

module.exports = {
  ingestSalaryController,
  getSalariesController,
  getCompanyController,
  compareController,
};
