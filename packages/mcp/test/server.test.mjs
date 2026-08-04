import test from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { compareReports, createServer } from '../src/server.mjs';

test('compareReports reports score and metadata changes', () => {
  const before = { url: 'https://example.com', title: 'Before', diagnostics: { score: 50, checks: [] } };
  const after = { url: 'https://example.com', title: 'After', diagnostics: { score: 80, checks: [] } };
  const comparison = compareReports(before, after);
  assert.equal(comparison.scoreDelta, 30);
  assert.deepEqual(comparison.changes, [{ field: 'title', before: 'Before', after: 'After' }]);
});

test('createServer exposes the complete read-only tool set', async (context) => {
  const server = createServer();
  const client = new Client({ name: 'linkglimpse-test', version: '1.0.0' });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  context.after(async () => {
    await client.close();
    await server.close();
  });

  await server.connect(serverTransport);
  await client.connect(clientTransport);
  const result = await client.listTools();

  assert.deepEqual(
    result.tools.map((tool) => tool.name).sort(),
    ['audit_url', 'audit_urls', 'compare_urls', 'get_fix_plan', 'render_previews'],
  );
  assert.equal(result.tools.every((tool) => tool.annotations?.readOnlyHint), true);
});
