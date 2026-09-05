import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { cli, BIN, fixture } from './helpers.mjs';
import { getCatalog, resolve } from '../src/index.mjs';

test('CLI catalog and resolve are exact library responses from any working directory', async (t) => {
  const { temp } = await fixture(t);
  const catalog = cli(['catalog'], '{"protocolVersion":"1.0"}', { cwd: temp });
  assert.equal(catalog.status, 0, catalog.stderr);
  assert.equal(catalog.stderr, '');
  assert.deepEqual(JSON.parse(catalog.stdout), await getCatalog());
  const request = { protocolVersion: '1.0', persona: 'developer', profiles: ['react', 'general'] };
  const resolved = cli(['resolve'], JSON.stringify(request), { cwd: temp });
  assert.equal(resolved.status, 0, resolved.stderr);
  assert.equal(resolved.stderr, '');
  assert.deepEqual(JSON.parse(resolved.stdout), await resolve(request));
  assert.equal(resolved.stdout.trim().split('\n').length, 1);
});

test('CLI rejects malformed, oversized, non-UTF8, wrong-version and extra JSON input', () => {
  for (const input of ['', '{}', '[]', 'null', '{', '{}\n{}', '{"protocolVersion":"9.9"}', '{"protocolVersion":"1.0","extra":1}', ' '.repeat(65537), Buffer.from([0xff])]) {
    const result = cli(['catalog'], input);
    assert.notEqual(result.status, 0);
    assert.equal(result.stdout, '');
    assert.equal(typeof JSON.parse(result.stderr).error, 'string');
  }
  const result = cli(['resolve'], '{"protocolVersion":"1.0","persona":"developer","profiles":["missing"]}');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unknown profile/);
});

test('CLI rejects unsupported commands, unknown/duplicate flags and positional arguments', () => {
  for (const args of [[], ['list'], ['affected'], ['resolve', '--json'], ['catalog', '--out', 'x'], ['check', 'x'], ['build', '--root'], ['build', '--root', 'a', '--root', 'b'], ['build', '--out', 'a', '--out', 'b'], ['--help', 'build'], ['build', '--version']]) {
    const result = cli(args);
    assert.notEqual(result.status, 0, args.join(' '));
    assert.equal(result.stdout, '');
  }
  assert.equal(cli(['--version']).stdout, '1.0.0\n');
  assert.match(cli(['--help']).stdout, /Patrol protocol 1.0/);
});

test('CLI build/check/validate write only temporary fixture output', async (t) => {
  const { root, out } = await fixture(t);
  assert.notEqual(cli(['check', '--root', root, '--out', out]).status, 0);
  for (const command of ['build', 'check', 'validate']) {
    const result = cli([command, '--root', root, '--out', out]);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).plugins.length, 10);
  }
});

test('CLI bounds stalled JSON stdin and exits nonzero without stdout', { timeout: 10000 }, async () => {
  const child = spawn(process.execPath, [BIN, 'catalog'], { stdio: ['pipe', 'pipe', 'pipe'] });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (bytes) => stdout += bytes);
  child.stderr.on('data', (bytes) => stderr += bytes);
  try {
    child.stdin.write('{');
    const [code] = await once(child, 'close');
    assert.notEqual(code, 0);
    assert.equal(stdout, '');
    assert.match(stderr, /timed out/);
  } finally { if (child.exitCode === null) child.kill(); }
});
