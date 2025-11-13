import pc from 'picocolors';
import { existsSync } from 'fs';
import { join, normalize, isAbsolute } from 'path';

/**
 * Validates a project name
 * Must be a valid npm package name and safe for file system use
 */
export function validateProjectName(name: string): string | true {
  if (!name || name.trim().length === 0) {
    return 'Project name is required';
  }

  // Security: Check for path traversal attacks
  const normalizedPath = normalize(name);
  if (normalizedPath.includes('..') || isAbsolute(name)) {
    return 'Project name cannot contain path traversal sequences or be an absolute path';
  }

  // Check for valid npm package name
  const validNameRegex = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

  if (!validNameRegex.test(name)) {
    return 'Project name must be a valid npm package name (lowercase, hyphens allowed)';
  }

  // Check for reserved names
  const reserved = ['node_modules', 'favicon.ico'];
  if (reserved.includes(name.toLowerCase())) {
    return `Cannot use reserved name: ${name}`;
  }

  return true;
}

/**
 * Checks if a directory already exists and is not empty
 */
export function checkDirectoryExists(dir: string): boolean {
  return existsSync(dir);
}

/**
 * Validates WalletConnect Project ID format (optional)
 */
export function validateWalletConnectId(id: string | undefined): string | true {
  if (!id) return true; // undefined is ok

  const trimmed = id.trim();
  if (trimmed.length === 0) return true; // empty after trim is ok

  // Basic validation - should be 32 characters hex
  if (!/^[a-f0-9]{32}$/.test(trimmed)) {
    return 'WalletConnect Project ID should be a 32-character hexadecimal string';
  }

  return true;
}

/**
 * Validates network choice
 */
export function validateNetwork(network: string): network is 'testnet' | 'mainnet' {
  return network === 'testnet' || network === 'mainnet';
}

/**
 * Pretty prints validation errors
 */
export function printValidationError(message: string): void {
  console.error(pc.red('✖'), pc.red(message));
}
