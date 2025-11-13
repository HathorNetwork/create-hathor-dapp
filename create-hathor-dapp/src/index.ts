#!/usr/bin/env node

import { Command } from 'commander';
import { createProject } from './commands/create.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from package.json
const pkg = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

program
  .name('create-hathor-dapp')
  .description('Create a new Hathor dApp project')
  .version(pkg.version)
  .argument('[project-name]', 'Name of the project')
  .option('-y, --yes', 'Skip prompts and use defaults (non-interactive mode)')
  .option('--wallet-connect-id <id>', 'WalletConnect Project ID')
  .option('--network <network>', 'Default network (testnet or mainnet)', 'testnet')
  .option('--skip-install', 'Skip dependency installation')
  .option('--skip-git', 'Skip git initialization')
  .action(async (projectName, options) => {
    try {
      await createProject(projectName, options);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Error:', message);
      if (error instanceof Error && error.stack) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

program.parse();
