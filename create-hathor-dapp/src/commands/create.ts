import { resolve, join } from 'path';
import { existsSync } from 'fs';
import pc from 'picocolors';
import ora from 'ora';
import { execa } from 'execa';
import { ProjectConfig } from '../types.js';
import {
  validateProjectName,
  validateWalletConnectId,
  validateNetwork,
  printValidationError,
  checkDirectoryExists,
} from '../utils/validation.js';
import { promptForConfig } from '../utils/prompts.js';
import { copyTemplate, processTemplate } from '../utils/template.js';
import { isGitAvailable, initGitRepo } from '../utils/git.js';
import { detectPackageManager, getInstallCommand, getDevCommand } from '../utils/packageManager.js';

interface CreateOptions {
  yes?: boolean;
  walletConnectId?: string;
  network?: string;
  skipInstall?: boolean;
  skipGit?: boolean;
}

/**
 * Main create command handler
 */
export async function createProject(projectName: string | undefined, options: CreateOptions) {
  console.log();
  console.log(pc.bold(pc.cyan('🎲 create-hathor-dapp')));
  console.log();

  let config: ProjectConfig;

  // If --yes flag is provided, use non-interactive mode
  if (options.yes) {
    // Validate required arguments in non-interactive mode
    if (!projectName) {
      printValidationError('Project name is required in non-interactive mode (--yes)');
      process.exit(1);
    }

    const nameValidation = validateProjectName(projectName);
    if (nameValidation !== true) {
      printValidationError(nameValidation);
      process.exit(1);
    }

    const networkValue = options.network || 'testnet';
    if (!validateNetwork(networkValue)) {
      printValidationError('Network must be either "testnet" or "mainnet"');
      process.exit(1);
    }

    if (options.walletConnectId) {
      const wcValidation = validateWalletConnectId(options.walletConnectId);
      if (wcValidation !== true) {
        printValidationError(wcValidation);
        process.exit(1);
      }
    }

    config = {
      projectName,
      projectDir: resolve(process.cwd(), projectName),
      walletConnectId: options.walletConnectId,
      network: networkValue as 'testnet' | 'mainnet',
      skipInstall: options.skipInstall || false,
      skipGit: options.skipGit || false,
    };
  } else {
    // Interactive mode
    const answers = await promptForConfig(
      projectName,
      options.walletConnectId,
      options.network as 'testnet' | 'mainnet' | undefined
    );

    if (!answers) {
      console.error(pc.red('✖ Failed to get project configuration'));
      process.exit(1);
    }

    const projectDir = projectName
      ? resolve(process.cwd(), projectName)
      : resolve(process.cwd(), answers.projectName);

    config = {
      projectName: answers.projectName,
      projectDir,
      walletConnectId: answers.walletConnectId,
      network: answers.network,
      skipInstall: !answers.installDeps,
      skipGit: !answers.initGit,
    };
  }

  // Check if directory already exists
  if (checkDirectoryExists(config.projectDir)) {
    printValidationError(`Directory ${config.projectName} already exists`);
    process.exit(1);
  }

  console.log(pc.dim('Creating project at:'), pc.cyan(config.projectDir));
  console.log();

  // Step 1: Copy template
  const copySpinner = ora('Copying template files...').start();
  try {
    copyTemplate(config.projectDir);
    copySpinner.succeed(pc.green('Template files copied'));
  } catch (error) {
    copySpinner.fail(pc.red('Failed to copy template'));
    const message = error instanceof Error ? error.message : String(error);
    console.error(pc.red(message));
    process.exit(1);
  }

  // Step 2: Process template (replace variables)
  const processSpinner = ora('Configuring project...').start();
  try {
    processTemplate(config);
    processSpinner.succeed(pc.green('Project configured'));
  } catch (error) {
    processSpinner.fail(pc.red('Failed to configure project'));
    const message = error instanceof Error ? error.message : String(error);
    console.error(pc.red(message));
    process.exit(1);
  }

  // Step 3: Initialize git repository
  if (!config.skipGit) {
    const gitSpinner = ora('Initializing git repository...').start();
    const hasGit = await isGitAvailable();

    if (hasGit) {
      const success = await initGitRepo(config.projectDir);
      if (success) {
        gitSpinner.succeed(pc.green('Git repository initialized'));
      } else {
        gitSpinner.warn(pc.yellow('Git initialization failed'));
      }
    } else {
      gitSpinner.warn(pc.yellow('Git not found, skipping initialization'));
    }
  }

  // Step 4: Install dependencies
  if (!config.skipInstall) {
    const pm = detectPackageManager();
    const installSpinner = ora(`Installing dependencies with ${pm}...`).start();

    try {
      await execa(pm, ['install'], {
        cwd: config.projectDir,
        stdio: 'ignore',
      });
      installSpinner.succeed(pc.green(`Dependencies installed with ${pm}`));
    } catch (error) {
      installSpinner.fail(pc.red('Failed to install dependencies'));
      const message = error instanceof Error ? error.message : String(error);
      console.log(pc.dim(`  Error: ${message}`));
      console.log(pc.yellow('\nYou can install them manually later with:'));
      console.log(pc.cyan(`  cd ${config.projectName}`));
      console.log(pc.cyan(`  ${getInstallCommand(pm)}`));
    }
  }

  // Success message
  console.log();
  console.log(pc.green('✓'), pc.bold('Project created successfully!'));
  console.log();

  // Next steps
  console.log(pc.bold('Next steps:'));
  console.log();
  console.log(pc.cyan(`  cd ${config.projectName}`));

  if (config.skipInstall) {
    const pm = detectPackageManager();
    console.log(pc.cyan(`  ${getInstallCommand(pm)}`));
  }

  if (!config.walletConnectId) {
    console.log();
    console.log(pc.yellow('⚠'), 'WalletConnect Project ID not configured');
    console.log(pc.dim('  Get one at: https://cloud.reown.com/'));
    console.log(pc.dim('  Then add it to .env.local'));
  }

  console.log();
  console.log(pc.cyan(`  ${getDevCommand(detectPackageManager())}`));
  console.log();
  console.log(pc.dim('Happy building! 🚀'));
  console.log();
}
