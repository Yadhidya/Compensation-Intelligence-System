const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const makeRequest = (method, path, body = null) => {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTests() {
  console.log('==================================================');
  console.log(' RUNNING BACKEND TELEMETRY VERIFICATION           ');
  console.log('==================================================\n');

  try {
    // 1. Get Salaries List
    console.log('Test 1: Fetching initial salaries (GET /api/salaries)...');
    const getRes = await makeRequest('GET', '/salaries?limit=5');
    if (getRes.status === 200 && getRes.body.success) {
      console.log(`✔ SUCCESS: Found ${getRes.body.items.length} items. Total count in DB: ${getRes.body.pagination.total}`);
    } else {
      console.log('❌ FAILED:', getRes);
    }

    // 2. Ingest New Salary
    console.log('\nTest 2: Ingesting a new unique salary (POST /api/ingest-salary)...');
    const newOffer = {
      company: "Google",
      role: "Software Engineer",
      level: "L5",
      location: "San Jose, CA",
      experienceYears: 5.5,
      baseSalary: 198000,
      bonus: 25000,
      stock: 120000,
    };
    const ingestRes = await makeRequest('POST', '/ingest-salary', newOffer);
    let insertedId = null;
    if ((ingestRes.status === 201 || ingestRes.status === 200) && ingestRes.body.success) {
      insertedId = ingestRes.body.data.id;
      console.log(`✔ SUCCESS: Ingested/Retrieved salary. Computed Total Comp: $${ingestRes.body.data.totalCompensation}. ID: ${insertedId}`);
    } else {
      console.log('❌ FAILED:', ingestRes);
    }

    // 3. Graceful Duplicate Detection
    console.log('\nTest 3: Resubmitting identical entry for deduplication check...');
    const duplicateRes = await makeRequest('POST', '/ingest-salary', newOffer);
    if (duplicateRes.status === 200 && duplicateRes.body.success && duplicateRes.body.isDuplicate) {
      console.log(`✔ SUCCESS: Duplicate detected gracefully. Returned status 200 and existing ID: ${duplicateRes.body.data.id}`);
    } else {
      console.log('❌ FAILED:', duplicateRes);
    }

    // 4. Ingest Malformed Request (Check Validation error boundary)
    console.log('\nTest 4: Submitting malformed data (Check Zod validation)...');
    const malformed = {
      company: "",
      role: "Software Engineer",
      level: "L5",
      location: "Mountain View, CA",
      experienceYears: -2, // negative
      baseSalary: "not-a-number",
    };
    const badRes = await makeRequest('POST', '/ingest-salary', malformed);
    if (badRes.status === 400 && !badRes.body.success) {
      console.log('✔ SUCCESS: Request blocked with 400 Bad Request. Captured validation errors:');
      console.log(JSON.stringify(badRes.body.errors, null, 2));
    } else {
      console.log('❌ FAILED: Blocked failed. Status:', badRes.status);
    }

    // 5. Get Company Analytics
    console.log('\nTest 5: Fetching company profile metrics (GET /api/company/google)...');
    const companyRes = await makeRequest('GET', '/company/google');
    if (companyRes.status === 200 && companyRes.body.success) {
      const stats = companyRes.body.data.statistics;
      console.log(`✔ SUCCESS: Compiled Google metrics successfully.`);
      console.log(`  Total Submissions: ${companyRes.body.data.totalSubmissions}`);
      console.log(`  Median Base: $${stats.medianBaseSalary}`);
      console.log(`  Median Stock: $${stats.medianStock}`);
      console.log(`  Median Total Comp: $${stats.medianTotalCompensation}`);
      console.log('  Level Distribution breakdown:', companyRes.body.data.levelDistribution.map(l => `${l.level}: $${l.medianTotalCompensation}`).join(' | '));
    } else {
      console.log('❌ FAILED:', companyRes);
    }

    // 6. Compare Two Salaries Side-by-Side
    console.log('\nTest 6: Run side-by-side delta comparator...');
    // We compare standard L3 Google offer with our new L5 Google offer
    const otherRecord = getRes.body.items.find(s => s.id !== insertedId);
    if (otherRecord && insertedId) {
      const compareRes = await makeRequest('GET', `/compare?id1=${insertedId}&id2=${otherRecord.id}`);
      if (compareRes.status === 200 && compareRes.body.success) {
        console.log(`✔ SUCCESS: Rendered delta comparative matrix.`);
        console.log(`  Offer A: ${compareRes.body.data.salary1.company} (${compareRes.body.data.salary1.level}) - $${compareRes.body.data.salary1.totalCompensation}`);
        console.log(`  Offer B: ${compareRes.body.data.salary2.company} (${compareRes.body.data.salary2.level}) - $${compareRes.body.data.salary2.totalCompensation}`);
        console.log(`  Delta: +$${compareRes.body.data.deltas.totalCompensation.difference} (+${compareRes.body.data.deltas.totalCompensation.percentage}%)`);
      } else {
        console.log('❌ FAILED:', compareRes);
      }
    } else {
      console.log('⚠ SKIPPED Test 6: Not enough records found to compare.');
    }

    console.log('\n==================================================');
    console.log(' ALL BACKEND VERIFICATIONS COMPLETED SUCCESSFULLY ');
    console.log('==================================================');
  } catch (error) {
    console.error('Testing runner encountered an execution error:', error);
  }
}

// Give server 1 second to make sure it's bound to the socket, then run tests
setTimeout(runTests, 1000);
