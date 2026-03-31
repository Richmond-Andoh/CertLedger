// Test backend API on port 8000
const axios = require('axios');

async function testPort8000() {
  console.log('🧪 Testing Backend API on Port 8000...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint on port 8000...');
    const healthResponse = await axios.get('http://localhost:8000/health');
    console.log('✅ Health check successful:', healthResponse.data);
    console.log('');

    // Test login endpoint
    console.log('2. Testing login endpoint...');
    const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
      username: 'student123',
      password: 'password123'
    });
    console.log('✅ Login successful:', loginResponse.data);
    console.log('');

    console.log('🎉 All API tests on port 8000 completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
  }
}

testPort8000();
