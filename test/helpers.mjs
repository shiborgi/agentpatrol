import { cp, mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export const ROOT = path.resolve(import.meta.dirname, '..');
export const BIN = path.join(ROOT, 'bin/agentpatrol.js');

export async function fixture(t) {
  const temp = await mkdtemp(path.join(await realpath(tmpdir()), 'agentpatrol-test-'));
  t.after(() => rm(temp, { recursive: true, force: true }));
  const root = path.join(temp, 'source');
  const out = path.join(temp, 'output');
  await mkdir(root);
  const catalog = JSON.parse(await readFile(path.join(ROOT, 'catalog.json'), 'utf8'));
  await cp(path.join(ROOT, 'catalog.json'), path.join(root, 'catalog.json'));
  const skills = new Set();
  for (const [kind, ids] of [['agents', catalog.personas], ['profiles', catalog.profiles]]) {
    for (const id of ids) {
      await cp(path.join(ROOT, kind, id), path.join(root, kind, id), { recursive: true });
      const descriptor = JSON.parse(await readFile(path.join(root, kind, id, kind === 'agents' ? 'persona.json' : 'profile.json'), 'utf8'));
      descriptor.skills.forEach((skill) => skills.add(skill));
    }
  }
  for (const skill of skills) await cp(path.join(ROOT, 'skills', skill), path.join(root, 'skills', skill), { recursive: true });
  return { root, out, temp };
}

export async function changeJSON(file, mutate) {
  const value = JSON.parse(await readFile(file, 'utf8'));
  mutate(value);
  await writeFile(file, JSON.stringify(value));
}

export function cli(args, input = '', options = {}) {
  const result = spawnSync(process.execPath, [BIN, ...args], {
    encoding: 'utf8', input, timeout: 10000, maxBuffer: 2 * 1024 * 1024, ...options,
  });
  if (result.error) throw result.error;
  return result;
}
