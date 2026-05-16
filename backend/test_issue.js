const axios = require('axios');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: './backend/.env' });

async function test() {
  try {
    // Generate a valid JWT token for a mock University Admin
    const token = jwt.sign(
      { userId: 'mock-user-id', role: 'university_admin' },
      process.env.JWT_SECRET || 'your-super-secret-jwt-secret-key-change-this-in-production',
      { expiresIn: '1h' }
    );

    console.log("Generated Token:", token);
    console.log("Sending request to backend...");

    const startTime = Date.now();
    const response = await axios.post(
      'http://localhost:8000/api/certificates/issue',
      {
        studentName: 'Test Student ' + Date.now(),
        studentId: 'TS-' + Date.now(),
        qualification: 'BSc Test',
        grade: 'First Class',
        issueDate: '2024-05-16',
        institution: 'Global Academic Ledger'
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000 // Wait up to 15 seconds
      }
    );

    console.log(`Success! Time taken: ${Date.now() - startTime}ms`);
    console.log(response.data);
  } catch (error) {
    if (error.response) {
      console.error("Backend returned error status:", error.response.status);
      console.error("Error data:", error.response.data);
    } else {
      console.error("Request failed without response:", error.message);
    }
  }
}

test();
