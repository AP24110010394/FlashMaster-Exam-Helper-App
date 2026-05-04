const BASE = 'http://localhost:5000/api';

async function req(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

function pass(msg) { console.log(`  ✅ ${msg}`); }
function fail(msg) { console.log(`  ❌ ${msg}`); }
function section(msg) { console.log(`\n━━ ${msg} ━━`); }

async function run() {
  let userToken, adminToken, userId;

  section('AUTH - User Login');
  let r = await req('POST', '/auth/login', { email: 'user@flashmaster.com', password: 'password123' });
  if (r.status === 200 && r.data.token) { userToken = r.data.token; userId = r.data.user?.id; pass('User login OK'); }
  else fail(`User login FAILED: ${JSON.stringify(r.data)}`);

  section('AUTH - Admin Login');
  r = await req('POST', '/auth/login', { email: 'admin@flashmaster.com', password: 'password123' });
  if (r.status === 200 && r.data.token) { adminToken = r.data.token; pass('Admin login OK'); }
  else fail(`Admin login FAILED: ${JSON.stringify(r.data)}`);

  section('AUTH - Wrong Password');
  r = await req('POST', '/auth/login', { email: 'user@flashmaster.com', password: 'wrongpassword' });
  if (r.status === 400) pass('Wrong password correctly rejected (400)');
  else fail(`Wrong password test FAILED - got ${r.status}`);

  section('ADMIN - Get All Users (admin token)');
  r = await req('GET', '/admin/users', null, adminToken);
  if (r.status === 200 && Array.isArray(r.data)) pass(`Admin fetched ${r.data.length} users OK`);
  else fail(`Admin users FAILED: ${JSON.stringify(r.data)}`);

  section('ADMIN - Get All Users (user token = should be denied)');
  r = await req('GET', '/admin/users', null, userToken);
  if (r.status === 403) pass('User correctly denied admin route (403)');
  else fail(`Expected 403 but got ${r.status}`);

  section('PROGRESS - Get Progress (user token)');
  r = await req('GET', '/progress', null, userToken);
  if (r.status === 200 || r.status === 404) pass(`Progress route OK (${r.status})`);
  else fail(`Progress FAILED: ${r.status} - ${JSON.stringify(r.data)}`);

  section('MATERIALS - Get Materials (no auth)');
  r = await req('GET', '/materials', null, null);
  if (r.status === 200 || r.status === 401) pass(`Materials route reachable (${r.status})`);
  else fail(`Materials FAILED: ${r.status}`);

  section('STUDY PLAN - Get Study Plan (user token)');
  r = await req('GET', '/studyplan', null, userToken);
  if (r.status === 200 || r.status === 404) pass(`Study plan route OK (${r.status})`);
  else fail(`Study plan FAILED: ${r.status} - ${JSON.stringify(r.data)}`);

  section('FLASHCARDS - Get Flashcards (user token)');
  r = await req('GET', '/flashcards', null, userToken);
  if (r.status === 200 || r.status === 404) pass(`Flashcards route OK (${r.status})`);
  else fail(`Flashcards FAILED: ${r.status} - ${JSON.stringify(r.data)}`);

  section('AUTH - Register Duplicate User');
  r = await req('POST', '/auth/register', { username: 'newtest', email: 'user@flashmaster.com', password: 'password123' });
  if (r.status === 400) pass('Duplicate email correctly rejected (400)');
  else fail(`Expected 400 but got ${r.status}`);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('All tests complete!');
}

run().catch(e => console.error('Test runner error:', e));
