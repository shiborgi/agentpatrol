#!/usr/bin/env node
import { main } from '../src/cli.mjs';

process.stdout.on('error', (error) => {
  process.stderr.write(`${JSON.stringify({ error: error.message })}\n`);
  process.exitCode = 1;
});
main().catch((error) => {
  process.stderr.write(`${JSON.stringify({ error: error.message })}\n`);
  process.exitCode = 1;
});
