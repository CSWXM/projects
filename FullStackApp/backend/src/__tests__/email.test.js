const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');

let server;

const credentials = {email: 'molly@books.com', password: 'mollymember'};
const invalidCredentials = {email: 'abby@books.com', password: 'abbymember'};
let user;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
});

test('GET Invalid URL', async () => {
  await request.get('/v0/so-not-a-real-end-point-ba-bip-de-doo-da/')
    .expect(404);
});

test('POST /v0/login invalid credentials', async () => {
  await request.post('/v0/login')
    .send(invalidCredentials)
    .expect(401);
});

test('POST /v0/login valid credentials', async () => {
  await request.post('/v0/login')
    .send(credentials)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((json) => {
      // console.log(JSON.stringify(json));
      user = JSON.parse(json['text']);
    });
});

// let aheader = {'Authorization': `Bearer ${bearerToken}`};

test('GET /v0/email', async () => {
  // console.log(`user: ${typeof user}`);
  // console.log(`user['accessToken']: ${user['accessToken']}`);
  await request.get('/v0/email')
    .set('Authorization', `Bearer ${user['accessToken']}`)
    .expect(200);
});

test('GET /v0/email invalid JWT', async () => {
  await request.get('/v0/email')
    .set('Authorization', `Bearer lbWFpbGFkZH`)
    .expect(403);
});

test('GET /v0/email no authorization header', async () => {
  await request.get('/v0/email')
    .expect(401);
});

test('GET /v0/email?mailbox=inbox (mailbox exists)', async () => {
  await request.get('/v0/email?mailbox=inbox')
    .set('Authorization', `Bearer ${user['accessToken']}`)
    .expect(200);
});

test('GET /v0/email?mailbox=newbox (mailbox not exists)', async () => {
  await request.get('/v0/email?mailbox=newbox')
    .set('Authorization', `Bearer ${user['accessToken']}`)
    .expect(404);
});

