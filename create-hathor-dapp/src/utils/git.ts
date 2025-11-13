import { execa } from 'execa';
import pc from 'picocolors';

/**
 * Checks if git is available on the system
 */
export async function isGitAvailable(): Promise<boolean> {
  try {
    await execa('git', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Initializes a git repository in the given directory
 */
export async function initGitRepo(dir: string): Promise<boolean> {
  try {
    // Initialize git repo
    await execa('git', ['init'], { cwd: dir, stdio: 'ignore' });

    // Create initial commit
    await execa('git', ['add', '.'], { cwd: dir, stdio: 'ignore' });
    await execa('git', ['commit', '-m', 'Initial commit from create-hathor-dapp'], {
      cwd: dir,
      stdio: 'ignore'
    });

    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('user.name') || errorMessage.includes('user.email')) {
      console.warn(pc.yellow('⚠'), pc.yellow('Git user not configured'));
      console.warn(pc.dim('  Run: git config --global user.name "Your Name"'));
      console.warn(pc.dim('  Run: git config --global user.email "you@example.com"'));
    } else {
      console.warn(pc.yellow('⚠'), pc.yellow('Failed to initialize git repository'));
    }
    return false;
  }
}
