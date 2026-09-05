import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, realpath, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { check, getCatalog } from '../src/index.mjs';

const root = path.resolve(import.meta.dirname, '..');
// Fail before npm pack or any fixture writes; never hide repository drift.
await check({ root });
const temp = await mkdtemp(path.join(await realpath(tmpdir()), 'agentpatrol-installed-'));

function run(command, args, cwd, input = '', env = process.env) {
  const result = spawnSync(command, args, { cwd, input, env, encoding: 'utf8', timeout: 60000, maxBuffer: 2 * 1024 * 1024 });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${command} ${args.join(' ')}\n${result.stderr}\n${result.stdout}`);
  return result.stdout;
}

try {
  const env = { ...process.env, npm_config_cache: path.join(temp, 'cache'), npm_config_offline: 'true', npm_config_ignore_scripts: 'true' };
  const packed = JSON.parse(run('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', temp], root, '', env))[0];
  assert.equal(packed.version, '1.0.0');
  const paths = packed.files.map(({ path }) => path);
  for (const required of ['catalog.json', 'src/index.mjs', 'bin/agentpatrol.js', 'agents/qa/persona.json', 'profiles/python/profile.json', 'skills/mcp-development/SKILL.md', 'plugins/profile-service/plugin.json', 'schemas/protocol.schema.json']) assert.ok(paths.includes(required), `Missing packed file: ${required}`);
  for (const file of paths) {
    assert.ok(!/^(test|scripts|\.git)\//.test(file), `Development file was packed: ${file}`);
    assert.ok(!file.includes('nextjs-engineer') && !file.includes('service-engineer'), `Unselected authoring was packed: ${file}`);
    assert.ok(!file.includes('/agentcontext/') && !file.endsWith('/agent.json'), `Non-distribution descriptor was packed: ${file}`);
  }
  const consumer = path.join(temp, 'consumer');
  await mkdir(consumer);
  run('npm', ['install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false', path.join(temp, packed.filename)], consumer, '', env);
  const installed = path.join(consumer, 'node_modules/agentpatrol');
  const pkg = JSON.parse(await readFile(path.join(installed, 'package.json'), 'utf8'));
  assert.equal(pkg.version, '1.0.0');
  assert.equal(pkg.engines.node, '>=22');
  assert.equal(Object.keys(pkg.dependencies ?? {}).length, 0);
  const installedEnv = { ...env, PATH: `${path.join(consumer, 'node_modules/.bin')}${path.delimiter}${process.env.PATH ?? ''}` };
  const call = (args, request) => run('agentpatrol', args, consumer, request ? JSON.stringify(request) : '', installedEnv);
  assert.equal(call(['--version']), '1.0.0\n');
  assert.match(call(['--help']), /catalog/);
  const library = await import(pathToFileURL(path.join(installed, 'src/index.mjs')).href);
  assert.deepEqual(Object.keys(library).sort(), ['PROTOCOL_VERSION', 'VERSION', 'build', 'canonicalJSON', 'check', 'digest', 'getCatalog', 'resolve', 'validate', 'validateManifest'].sort());
  const catalog = JSON.parse(call(['catalog'], { protocolVersion: '1.0' }));
  assert.deepEqual(catalog, await library.getCatalog());
  assert.match(catalog.contentDigest, /^[a-f0-9]{64}$/);
  assert.equal(catalog.contentDigest, (await getCatalog({ root })).contentDigest);
  for (const persona of catalog.personas) {
    const request = { protocolVersion: '1.0', persona: persona.id, profiles: catalog.profiles.map(({ id }) => id).reverse() };
    const resolved = JSON.parse(call(['resolve'], request));
    assert.deepEqual(resolved, await library.resolve(request));
    assert.equal(resolved.catalogDigest, catalog.contentDigest);
    const { digest, ...payload } = resolved;
    assert.equal(digest, library.digest(payload));
    assert.ok(!JSON.stringify(resolved).includes(root));
    assert.ok(!JSON.stringify(resolved).includes(temp));
  }
  // Resolve by package name through the public exports map from a fresh consumer.
  run(process.execPath, ['--input-type=module', '--eval', "import { getCatalog, VERSION } from 'agentpatrol'; if (VERSION !== '1.0.0' || (await getCatalog()).personas.length !== 4) process.exit(1);"], consumer, '', installedEnv);
  assert.equal(JSON.parse(call(['check'])).valid, true);
  assert.equal(JSON.parse(call(['validate'])).valid, true);
  const out = path.join(temp, 'portable');
  assert.equal(JSON.parse(call(['build', '--out', out])).plugins.length, 10);
  assert.equal(JSON.parse(call(['check', '--out', out])).valid, true);
  assert.equal((await library.validate({ out })).valid, true);
  const failure = spawnSync('agentpatrol', ['resolve'], { cwd: consumer, env: installedEnv, encoding: 'utf8', input: '{"protocolVersion":"1.0","persona":"developer","profiles":["unknown"]}', timeout: 10000 });
  assert.notEqual(failure.status, 0);
  assert.equal(failure.stdout, '');
  assert.match(failure.stderr, /Unknown profile/);
  process.stdout.write(`Installed-package smoke passed: agentpatrol@${pkg.version}, ${paths.length} packed files, 4 personas, 6 profiles, 10 plugins.\n`);
} finally {
  // Only this script's own temporary tree is removed, never repository output.
  await rm(temp, { recursive: true, force: true });
}
