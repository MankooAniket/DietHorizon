// Simple manual integration tests for the DietHorizon API.
// Run the backend server first (node server.js), then run:
//   node tests/index.js
//
// These tests do NOT use Jest or any test framework – they just
// make HTTP requests and log expected vs actual results.

const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config(); // Load backend .env (MONGO_URI, PORT, etc.)

const BASE_URL =
  process.env.TEST_BASE_URL ||
  `http://localhost:${process.env.PORT || 3300}/api`;

const tests = [];

function addTest(name, fn) {
  tests.push({ name, fn });
}

function logResult(name, ok, details) {
  const prefix = ok ? '[PASS]' : '[FAIL]';
  console.log(`${prefix} ${name}`);
  if (details) {
    console.log('  ', details);
  }
}

// ---------- Core auth + user flow ----------

addTest('Auth: register new user', async (ctx) => {
  const timestamp = Date.now();
  const email = `test${timestamp}@example.com`;
  const password = 'Test1234!';

  ctx.testUser = {
    name: 'Test User',
    email,
    password,
  };

  const res = await axios.post(`${BASE_URL}/auth/register`, {
    name: ctx.testUser.name,
    email: ctx.testUser.email,
    password: ctx.testUser.password,
    role: 'user',
  });

  if (res.status !== 201) {
    throw new Error(`Expected status 201, got ${res.status}`);
  }

  return {
    expectedStatus: 201,
    actualStatus: res.status,
  };
});

addTest('Auth: login as registered user', async (ctx) => {
  const res = await axios.post(`${BASE_URL}/auth/login`, {
    email: ctx.testUser.email,
    password: ctx.testUser.password,
  });

  if (res.status !== 200) {
    throw new Error(`Expected status 200, got ${res.status}`);
  }
  if (!res.data || !res.data.token) {
    throw new Error('Expected a token in response body');
  }

  ctx.userToken = res.data.token;
  ctx.userAuthHeaders = {
    Authorization: `Bearer ${ctx.userToken}`,
  };

  return {
    expectedStatus: 200,
    actualStatus: res.status,
    hasToken: !!ctx.userToken,
  };
});

addTest('Auth: get current user (/auth/me)', async (ctx) => {
  const res = await axios.get(`${BASE_URL}/auth/me`, {
    headers: ctx.userAuthHeaders,
  });

  if (res.status !== 200) {
    throw new Error(`Expected status 200, got ${res.status}`);
  }

  return {
    expectedStatus: 200,
    actualStatus: res.status,
  };
});

// ---------- Public catalog endpoints ----------

addTest('Products: list all products (/products)', async (ctx) => {
  const res = await axios.get(`${BASE_URL}/products`);

  if (res.status !== 200) {
    throw new Error(`Expected status 200, got ${res.status}`);
  }

  const list = Array.isArray(res.data?.data) ? res.data.data : [];
  if (list.length > 0) {
    ctx.sampleProductId = list[0]._id || list[0].id;
  }

  return {
    expectedStatus: 200,
    actualStatus: res.status,
    itemsReturned: list.length,
  };
});

addTest('Products: featured products (/products/featured)', async () => {
  const res = await axios.get(`${BASE_URL}/products/featured`);
  if (res.status !== 200) {
    throw new Error(`Expected status 200, got ${res.status}`);
  }
  return {
    expectedStatus: 200,
    actualStatus: res.status,
  };
});

addTest('Categories: list all categories (/categories)', async () => {
  const res = await axios.get(`${BASE_URL}/categories`);
  if (res.status !== 200) {
    throw new Error(`Expected status 200, got ${res.status}`);
  }
  return {
    expectedStatus: 200,
    actualStatus: res.status,
  };
});

// ---------- Authenticated user endpoints ----------

addTest('Cart: get current user cart (/cart)', async (ctx) => {
  const res = await axios.get(`${BASE_URL}/cart`, {
    headers: ctx.userAuthHeaders,
  });

  if (res.status !== 200) {
    throw new Error(`Expected status 200, got ${res.status}`);
  }

  return {
    expectedStatus: 200,
    actualStatus: res.status,
  };
});

addTest('Orders: get my orders (/orders)', async (ctx) => {
  const res = await axios.get(`${BASE_URL}/orders`, {
    headers: ctx.userAuthHeaders,
  });

  if (res.status !== 200) {
    throw new Error(`Expected status 200, got ${res.status}`);
  }

  return {
    expectedStatus: 200,
    actualStatus: res.status,
  };
});

addTest('Diet plans: get my diet plans (/diet-plans)', async (ctx) => {
  const res = await axios.get(`${BASE_URL}/diet-plans`, {
    headers: ctx.userAuthHeaders,
  });

  if (res.status !== 200) {
    throw new Error(`Expected status 200, got ${res.status}`);
  }

  return {
    expectedStatus: 200,
    actualStatus: res.status,
  };
});

addTest('Workout plans: get my workout plans (/workout-plans)', async (ctx) => {
  const res = await axios.get(`${BASE_URL}/workout-plans`, {
    headers: ctx.userAuthHeaders,
  });

  if (res.status !== 200) {
    throw new Error(`Expected status 200, got ${res.status}`);
  }

  return {
    expectedStatus: 200,
    actualStatus: res.status,
  };
});

// ---------- Recipe generator (depends on external API key) ----------

addTest('Recipes: get recipes by ingredients (/recipes)', async () => {
  const res = await axios.post(`${BASE_URL}/recipes`, {
    ingredients: 'chicken, rice',
  });

  if (res.status !== 200) {
    throw new Error(`Expected status 200, got ${res.status}`);
  }

  return {
    expectedStatus: 200,
    actualStatus: res.status,
  };
});

// ---------- Runner ----------

async function run() {
  console.log(`Running ${tests.length} tests against ${BASE_URL}`);
  const ctx = {};

  for (const { name, fn } of tests) {
    try {
      const details = await fn(ctx);
      logResult(name, true, details);
    } catch (err) {
      const details = {
        message: err.message,
      };

      if (err.response) {
        details.status = err.response.status;
        details.responseBody = err.response.data;
      }

      logResult(name, false, details);
    }
  }
}

run()
  .then(() => {
    console.log('Finished running tests.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Unexpected error while running tests:', err);
    process.exit(1);
  });

