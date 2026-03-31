// Test backend API integration
const axios = require('axios');

async function testBackendIntegration() {
  console.log('🧪 Testing Backend API Integration...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check:', healthResponse.data);
    console.log('');

    // Test login with demo credentials
    console.log('2. Testing login endpoint...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'student123',
      password: 'password123'
    });
    console.log('✅ Login response:', loginResponse.data);
    console.log('');

    // Test certificate verification
    console.log('3. Testing certificate verification...');
    const verifyResponse = await axios.post('http://localhost:5000/api/certificates/verify', {
      studentName: 'John Doe',
      studentId: 'STU001',
      institution: 'Test University',
      qualification: 'Computer Science',
      issueDate: '2023-01-15',
      grade: 'First Class'
    });
    console.log('✅ Certificate verification:', verifyResponse.data);
    console.log('');

    console.log('🎉 All API tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
  }
}

testBackendIntegration();
