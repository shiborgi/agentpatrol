import path from 'node:path';
import { assert, readTree } from './core.mjs';

export async function loadSkill(root, id) {
  const files = await readTree(path.join(root, 'skills', id));
  assert(files.has('SKILL.md'), `Missing SKILL.md: ${id}`);
  const instructions = new TextDecoder('utf-8', { fatal: true }).decode(files.get('SKILL.md')).trim();
  const frontmatter = instructions.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert(frontmatter, `Missing skill frontmatter: ${id}`);
  const fields = new Map();
  for (const line of frontmatter[1].split(/\r?\n/)) {
    const match = line.match(/^([a-z-]+): (.+)$/);
    assert(match && ['name', 'description', 'license'].includes(match[1]) && !fields.has(match[1]), `Unsupported or duplicate skill frontmatter: ${id}`);
    assert(!/^[\[\]{}&*!|>'"%@`#]/.test(match[2]) && !/:\s|\s#/.test(match[2]) && !/^(?:null|true|false|~|[-+]?\d+(?:\.\d+)?)$/i.test(match[2]), `Skill frontmatter must use plain text scalars: ${id}`);
    fields.set(match[1], match[2]);
  }
  assert(fields.get('name') === id, `Skill name mismatch: ${id}`);
  assert(fields.get('description')?.trim() && fields.get('description').length <= 1024, `Invalid skill description: ${id}`);
  const sections = instructions.split(/^## /m).slice(1).map((part) => {
    const newline = part.indexOf('\n');
    return [part.slice(0, newline).trim(), part.slice(newline + 1).trim()];
  });
  for (const section of ['Inputs', 'Procedure', 'Output', 'Verification', 'Safety']) {
    const matches = sections.filter(([heading]) => heading === section);
    assert(matches.length === 1 && matches[0][1] && !matches[0][1].startsWith('# '), `Missing, empty or duplicate ${section} section: ${id}`);
  }
  // Local Markdown assets must stay inside this skill and ship with the plugin.
  for (const [name, bytes] of files) {
    if (!name.endsWith('.md')) continue;
    const markdown = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    const targets = [
      ...markdown.matchAll(/\]\(\s*(?:<([^>\r\n]+)>|([^\s)]+))(?:\s+"[^"]*")?\s*\)/g),
      ...markdown.matchAll(/^ {0,3}\[[^\]\r\n]+\]:\s*(?:<([^>\r\n]+)>|(\S+))/gm),
    ];
    for (const match of targets) {
      const target = match[1] ?? match[2];
      if (/^https?:\/\//.test(target) || target.startsWith('#')) continue;
      const local = decodeURIComponent(target.split(/[?#]/)[0]);
      assert(!local.includes('\\') && !local.startsWith('/') && !/^[a-zA-Z]+:/.test(local), `Unsafe skill reference: ${id}/${name}`);
      const normalized = path.posix.normalize(path.posix.join(path.posix.dirname(name), local));
      assert(!normalized.startsWith('../') && normalized !== '..' && files.has(normalized), `Missing or escaping skill reference: ${id}/${target}`);
    }
  }
  return { id, instructions, files };
}
