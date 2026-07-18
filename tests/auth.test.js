import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';

const { default: app } = await import('../server.js');

const startServer = () => new Promise((resolve) => {
  const server = app.listen(0, () => resolve(server));
});

test('account login route is available', async () => {
  const server = await startServer();

  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/account/login`);
    assert.equal(response.status, 200);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
});

test('registration and login create a session and reach the dashboard', async () => {
  const server = await startServer();

  try {
    const registerResponse = await fetch(`http://127.0.0.1:${server.address().port}/register`, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: 'name=Test+User&email=auth-test@example.com&password=secret123&role=Customer'
    });

    assert.equal(registerResponse.status, 302);

    const loginResponse = await fetch(`http://127.0.0.1:${server.address().port}/login`, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: 'email=auth-test@example.com&password=secret123'
    });

    assert.equal(loginResponse.status, 302);

    const setCookie = loginResponse.headers.get('set-cookie');
    assert.ok(setCookie);

    const dashboardResponse = await fetch(`http://127.0.0.1:${server.address().port}/dashboard`, {
      redirect: 'manual',
      headers: {
        cookie: setCookie
      }
    });

    assert.equal(dashboardResponse.status, 200);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
});
