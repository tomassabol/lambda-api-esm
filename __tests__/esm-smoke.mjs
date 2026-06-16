import createAPI from '../dist/esm/index.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sampleEvent = JSON.parse(
  readFileSync(
    join(__dirname, 'sample-event-apigateway-v1.json'),
    'utf8'
  )
);

const api = createAPI({ version: 'v1.0', logger: false });

api.get('/test', (req, res) => {
  res.json({ ok: true, method: req.method, path: req.path });
});

const event = {
  ...sampleEvent,
  httpMethod: 'GET',
  path: '/test',
  body: null,
};

const result = await api.run(event, { awsRequestId: 'esm-smoke-test' });

if (result.statusCode !== 200) {
  console.error('Expected statusCode 200, got', result.statusCode);
  process.exit(1);
}

const body = JSON.parse(result.body);

if (body.ok !== true || body.method !== 'GET' || body.path !== '/test') {
  console.error('Unexpected response body:', body);
  process.exit(1);
}

console.log('ESM smoke test passed');
