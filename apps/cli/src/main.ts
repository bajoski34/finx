#!/usr/bin/env node

import { Command } from 'commander';
import { version } from '../package.json';

const program = new Command();

program
  .name('finx')
  .description('Fintech framework CLI for managing adapters, sandbox, and development')
  .version(version);

// Adapter commands
const adapterCmd = program
  .command('adapter')
  .description('Manage fintech adapters');

adapterCmd
  .command('new <name>')
  .description('Create a new adapter')
  .option('-t, --type <type>', 'Adapter type (payment, payout, kyc)', 'payment')
  .action((name, options) => {
    console.log(`🚀 Creating new ${options.type} adapter: ${name}`);
    // TODO: Implement adapter scaffolding
  });

adapterCmd
  .command('list')
  .description('List available adapters')
  .action(() => {
    console.log('📋 Available adapters:');
    console.log('  - sandbox (mock provider for tests & demos)');
    // TODO: Implement adapter discovery
  });

// Sandbox commands
program
  .command('sandbox')
  .description('Start development sandbox')
  .option('-p, --port <port>', 'Port number', '3001')
  .action((options) => {
    console.log(`🏖️  Starting sandbox on port ${options.port}`);
    // TODO: Implement sandbox server
  });

// Route testing commands
program
  .command('routes')
  .description('Test routing policies')
  .command('test')
  .description('Test routing configuration')
  .action(() => {
    console.log('🧪 Testing routing policies...');
    // TODO: Implement route testing
  });

// Reconciliation commands
program
  .command('recon')
  .description('Reconciliation utilities')
  .command('import <file>')
  .description('Import reconciliation statements')
  .action((file) => {
    console.log(`📊 Importing reconciliation file: ${file}`);
    // TODO: Implement reconciliation import
  });

program.parse();