
const BASE_URL = 'http://localhost:3000';

async function testHealth() {
  console.log('Testing /api/health...');
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    console.log('Response:', data);
    if (res.status === 200 && data.status === 'healthy') {
      console.log('✅ Health check passed');
    } else {
      console.error('❌ Health check failed');
    }
  } catch (err) {
    console.error('❌ Health check error:', err.message);
  }
}

async function testAuth() {
  console.log('\nTesting /api/auth/login...');
  
  // Test success
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'admin', password: 'biotech' }),
    });
    const data = await res.json();
    if (res.status === 200 && data.success && data.token) {
      console.log('✅ Auth success check passed');
    } else {
      console.error('❌ Auth success check failed', data);
    }
  } catch (err) {
    console.error('❌ Auth success check error:', err.message);
  }

  // Test failure
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'admin', password: 'wrongpassword' }),
    });
    const data = await res.json();
    if (res.status === 401 && !data.success) {
      console.log('✅ Auth failure check passed');
    } else {
      console.error('❌ Auth failure check failed', data);
    }
  } catch (err) {
    console.error('❌ Auth failure check error:', err.message);
  }
}

async function testCopilot() {
  console.log('\nTesting /api/copilot/chat...');
  
  // Test specific response
  try {
    const res = await fetch(`${BASE_URL}/api/copilot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What about 21 CFR Part 11.10(e)?' }),
    });
    const data = await res.json();
    if (res.status === 200 && data.response.includes('audit trail captures the exact timestamp')) {
      console.log('✅ Copilot specific check passed');
    } else {
      console.error('❌ Copilot specific check failed', data);
    }
  } catch (err) {
    console.error('❌ Copilot specific check error:', err.message);
  }

  // Test random response
  try {
    const res = await fetch(`${BASE_URL}/api/copilot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello AI' }),
    });
    const data = await res.json();
    if (res.status === 200 && data.response && data.response.length > 0) {
      console.log('✅ Copilot random check passed');
    } else {
      console.error('❌ Copilot random check failed', data);
    }
  } catch (err) {
    console.error('❌ Copilot random check error:', err.message);
  }
}

async function run() {
  await testHealth();
  await testAuth();
  await testCopilot();
}

run();
