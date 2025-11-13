import { execaSync } from 'execa';
import { PackageManager } from '../types.js';

/**
 * Detects which package manager to use
 * Priority: pnpm > yarn > npm
 */
export function detectPackageManager(): PackageManager {
  try {
    // Check if pnpm is available
    execaSync('pnpm', ['--version'], { stdio: 'ignore' });
    return 'pnpm';
  } catch {
    // pnpm not found
  }

  try {
    // Check if yarn is available
    execaSync('yarn', ['--version'], { stdio: 'ignore' });
    return 'yarn';
  } catch {
    // yarn not found
  }

  // Default to npm (always available with Node.js)
  return 'npm';
}

/**
 * Gets the install command for a package manager
 */
export function getInstallCommand(pm: PackageManager): string {
  switch (pm) {
    case 'pnpm':
      return 'pnpm install';
    case 'yarn':
      return 'yarn install';
    case 'npm':
      return 'npm install';
  }
}

/**
 * Gets the dev command for a package manager
 */
export function getDevCommand(pm: PackageManager): string {
  switch (pm) {
    case 'pnpm':
      return 'pnpm dev';
    case 'yarn':
      return 'yarn dev';
    case 'npm':
      return 'npm run dev';
  }
}
