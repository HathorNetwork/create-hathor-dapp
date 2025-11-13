import { readFileSync, writeFileSync, cpSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ProjectConfig } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the template directory path
 */
export function getTemplateDir(): string {
  // In compiled code, __dirname points to dist/
  // Template is at the root level alongside dist/
  return join(__dirname, '../../template');
}

/**
 * Copies the template to the target directory
 */
export function copyTemplate(targetDir: string): void {
  const templateDir = getTemplateDir();

  // Create target directory if it doesn't exist
  mkdirSync(targetDir, { recursive: true });

  // Copy all template files
  cpSync(templateDir, targetDir, {
    recursive: true,
    filter: (src) => {
      // Skip node_modules and build artifacts if they exist in template
      const name = src.split('/').pop() || '';
      return !['node_modules', '.next', 'dist', '.git'].includes(name);
    },
  });
}

/**
 * Processes template variables in specific files
 */
export function processTemplate(config: ProjectConfig): void {
  const { projectDir, projectName, walletConnectId, network } = config;

  // 1. Update package.json
  updatePackageJson(projectDir, projectName);

  // 2. Update app/layout.tsx metadata
  updateLayoutMetadata(projectDir, projectName);

  // 3. Update lib/walletConnectConfig.ts
  updateWalletConnectConfig(projectDir, projectName);

  // 4. Create .env.local from .env.example
  createEnvLocal(projectDir, walletConnectId, network);

  // 5. Update README.md
  updateReadme(projectDir, projectName);
}

/**
 * Updates package.json with project name
 */
function updatePackageJson(projectDir: string, projectName: string): void {
  const pkgPath = join(projectDir, 'package.json');
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    pkg.name = projectName;
    pkg.version = '0.1.0';
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update package.json: ${message}`);
  }
}

/**
 * Updates app/layout.tsx with project name
 */
function updateLayoutMetadata(projectDir: string, projectName: string): void {
  const layoutPath = join(projectDir, 'app/layout.tsx');
  try {
    let content = readFileSync(layoutPath, 'utf-8');

    // Convert kebab-case to Title Case for display
    const displayName = projectName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Escape special characters in displayName
    const escapedName = displayName.replace(/'/g, "\\'");

    // Replace title
    content = content.replace(
      /title: ['"].*?['"]/,
      `title: '${escapedName}'`
    );

    // Replace description
    content = content.replace(
      /description: ['"].*?['"]/,
      `description: 'A decentralized application built on Hathor Network'`
    );

    writeFileSync(layoutPath, content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update app/layout.tsx: ${message}`);
  }
}

/**
 * Updates lib/walletConnectConfig.ts with project name
 */
function updateWalletConnectConfig(projectDir: string, projectName: string): void {
  const configPath = join(projectDir, 'lib/walletConnectConfig.ts');
  try {
    let content = readFileSync(configPath, 'utf-8');

    const displayName = projectName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Escape special characters in displayName
    const escapedName = displayName.replace(/'/g, "\\'");

    // Replace name in WALLETCONNECT_METADATA
    content = content.replace(
      /name: ['"].*?['"]/,
      `name: '${escapedName}'`
    );

    writeFileSync(configPath, content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update walletConnectConfig.ts: ${message}`);
  }
}

/**
 * Creates .env.local from .env.example with user configuration
 */
function createEnvLocal(
  projectDir: string,
  walletConnectId: string | undefined,
  network: 'testnet' | 'mainnet'
): void {
  const envExamplePath = join(projectDir, '.env.example');
  const envLocalPath = join(projectDir, '.env.local');

  try {
    let content = readFileSync(envExamplePath, 'utf-8');

    // Replace WalletConnect Project ID if provided
    if (walletConnectId) {
      content = content.replace(
        /NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=.*/,
        `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=${walletConnectId}`
      );
    }

    // Replace network
    content = content.replace(
      /NEXT_PUBLIC_HATHOR_NETWORK=.*/,
      `NEXT_PUBLIC_HATHOR_NETWORK=${network}`
    );

    writeFileSync(envLocalPath, content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create .env.local: ${message}`);
  }
}

/**
 * Updates README.md with project name
 */
function updateReadme(projectDir: string, projectName: string): void {
  const readmePath = join(projectDir, 'README.md');
  try {
    let content = readFileSync(readmePath, 'utf-8');

    const displayName = projectName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Replace the main title (first # heading)
    content = content.replace(
      /^# .+$/m,
      `# ${displayName}`
    );

    writeFileSync(readmePath, content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update README.md: ${message}`);
  }
}
