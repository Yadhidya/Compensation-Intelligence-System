const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Handles response JSON formatting and errors
 */
const handleResponse = async (response) => {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMsg = data?.message || `API error (status: ${response.status})`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.errors = data?.errors || null;
    throw error;
  }

  return data;
};

/**
 * Fetch salaries list with filters, sorting, and pagination
 */
export const fetchSalaries = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  try {
    const response = await fetch(`${API_BASE_URL}/salaries?${queryParams}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('API Error in fetchSalaries:', error);
    throw error;
  }
};

/**
 * Fetch aggregation and analytics for a company
 */
export const fetchCompanyData = async (companyName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/company/${encodeURIComponent(companyName)}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error in fetchCompanyData for ${companyName}:`, error);
    throw error;
  }
};

/**
 * Fetch side-by-side comparison for two specific salary IDs
 */
export const fetchComparison = async (id1, id2) => {
  try {
    const response = await fetch(`${API_BASE_URL}/compare?id1=${id1}&id2=${id2}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error in fetchComparison for IDs (${id1}, ${id2}):`, error);
    throw error;
  }
};

/**
 * Ingest a new salary record
 */
export const ingestSalary = async (salaryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ingest-salary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(salaryData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('API Error in ingestSalary:', error);
    throw error;
  }
};
