import { createHash } from 'node:crypto';
import { lstat, open, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

export const VERSION = '1.0.0';
export const PROTOCOL_VERSION = '1.0';
export const DEFAULT_ROOT = path.resolve(import.meta.dirname, '..');
export const MAX_OUTPUT_BYTES = 1024 * 1024;
export const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function object(value, keys, label) {
  assert(value !== null && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`);
  assert(Object.keys(value).every((key) => keys.includes(key)), `${label} has unknown fields`);
  assert(keys.every((key) => Object.hasOwn(value, key)), `${label} is missing required fields`);
}

export function text(value, label) {
  assert(typeof value === 'string' && value.trim().length > 0, `${label} must be nonempty text`);
}

export function ids(value, label, { unique = true } = {}) {
  assert(Array.isArray(value) && value.length <= 128, `${label} must be an array of at most 128 IDs`);
  assert(value.every((id) => typeof id === 'string' && id.length <= 64 && ID.test(id)), `${label} contains an invalid ID`);
  assert(!unique || new Set(value).size === value.length, `${label} contains duplicate IDs`);
}

// Serialize keys directly: JSON.stringify reorders integer-like object keys.
export function canonicalJSON(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJSON).join(',')}]`;
  if (value !== null && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJSON(value[key])}`).join(',')}}`;
  }
  assert(value === null || ['string', 'boolean', 'number'].includes(typeof value), 'Value is not JSON');
  assert(typeof value !== 'number' || Number.isFinite(value), 'Value is not finite JSON');
  return JSON.stringify(value);
}

export function digest(value) {
  return createHash('sha256').update(canonicalJSON(value), 'utf8').digest('hex');
}

export function json(value) {
  return `${canonicalJSON(value)}\n`;
}

export function contained(root, relative) {
  assert(typeof relative === 'string' && relative.length > 0 && !relative.includes('\\') && !path.isAbsolute(relative), 'Expected a relative path');
  assert(relative.split('/').every((part) => part && part !== '.' && part !== '..'), `Unsafe path: ${relative}`);
  return path.join(root, relative);
}

// Reject symlinks in every component, including output ancestors, before I/O.
export async function safePath(file, { missing = false } = {}) {
  const absolute = path.resolve(file);
  const { root } = path.parse(absolute);
  let current = root;
  for (const part of absolute.slice(root.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    let stat;
    try { stat = await lstat(current); } catch (error) {
      if (missing && error.code === 'ENOENT') return absolute;
      throw error;
    }
    assert(!stat.isSymbolicLink(), `Symlink is not allowed: ${current}`);
    assert(stat.isDirectory() || (current === absolute && stat.isFile()), `Unsupported path type: ${current}`);
    if (stat.isFile()) assert(stat.nlink === 1, `Hard-linked file is not allowed: ${current}`);
  }
  return absolute;
}

export async function readBytes(file) {
  await safePath(file);
  const handle = await open(file, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const stat = await handle.stat();
    assert(stat.isFile() && stat.nlink === 1 && stat.size <= MAX_OUTPUT_BYTES, `Invalid or oversized file: ${file}`);
    const buffer = Buffer.alloc(MAX_OUTPUT_BYTES + 1);
    let size = 0;
    while (size < buffer.length) {
      const { bytesRead } = await handle.read(buffer, size, buffer.length - size, null);
      if (!bytesRead) break;
      size += bytesRead;
    }
    assert(size <= MAX_OUTPUT_BYTES, `Oversized file: ${file}`);
    return Buffer.from(buffer.subarray(0, size));
  } finally { await handle.close(); }
}

export async function readText(file) {
  return new TextDecoder('utf-8', { fatal: true }).decode(await readBytes(file));
}

export async function readJSON(file) {
  return JSON.parse(await readText(file));
}

export async function readTree(root) {
  const files = new Map();
  let bytes = 0;
  let entries = 0;
  async function visit(relative, depth) {
    assert(depth <= 16, `Tree is too deep: ${root}`);
    const directory = relative ? contained(root, relative) : root;
    await safePath(directory);
    for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      assert(++entries <= 2048, `Too many tree entries: ${root}`);
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      const file = contained(root, name);
      await safePath(file);
      if (entry.isDirectory()) await visit(name, depth + 1);
      else {
        const content = await readBytes(file);
        bytes += content.length;
        assert(bytes <= 8 * MAX_OUTPUT_BYTES, `Tree is too large: ${root}`);
        files.set(name, content);
      }
    }
  }
  await visit('', 0);
  return files;
}
