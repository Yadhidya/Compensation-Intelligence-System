const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salary.controller');

// Salary Ingestion Endpoint
router.post('/ingest-salary', salaryController.ingestSalaryController);

// Retrieve Salary List (Filtered, Sorted, Paginated)
router.get('/salaries', salaryController.getSalariesController);

// Compare Tool Side-by-Side
router.get('/compare', salaryController.compareController);

// Company Metrics & Analytics
router.get('/company/:company', salaryController.getCompanyController);

module.exports = router;
