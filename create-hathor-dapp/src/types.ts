export interface ProjectConfig {
  projectName: string;
  projectDir: string;
  walletConnectId?: string;
  network: 'testnet' | 'mainnet';
  skipInstall: boolean;
  skipGit: boolean;
}

export type PackageManager = 'npm' | 'yarn' | 'pnpm';
