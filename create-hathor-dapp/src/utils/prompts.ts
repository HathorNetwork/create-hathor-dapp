import prompts from 'prompts';
import pc from 'picocolors';
import { validateProjectName, validateWalletConnectId } from './validation.js';

export interface PromptAnswers {
  projectName: string;
  walletConnectId?: string;
  network: 'testnet' | 'mainnet';
  installDeps: boolean;
  initGit: boolean;
}

/**
 * Prompts user for project configuration
 * Only prompts for missing values
 */
export async function promptForConfig(
  projectName?: string,
  walletConnectId?: string,
  network?: 'testnet' | 'mainnet'
): Promise<PromptAnswers | null> {
  try {
    const questions: prompts.PromptObject[] = [];

    // Only ask for project name if not provided
    if (!projectName) {
      questions.push({
        type: 'text',
        name: 'projectName',
        message: 'What is your project named?',
        initial: 'my-hathor-dapp',
        validate: (value: string) => {
          const result = validateProjectName(value);
          return result === true ? true : result;
        },
      });
    }

    // Ask for WalletConnect ID if not provided
    if (walletConnectId === undefined) {
      questions.push({
        type: 'text',
        name: 'walletConnectId',
        message: 'WalletConnect Project ID (optional, press enter to skip):',
        validate: (value: string) => {
          const result = validateWalletConnectId(value);
          return result === true ? true : result;
        },
      });
    }

    // Ask for network if not provided
    if (!network) {
      questions.push({
        type: 'select',
        name: 'network',
        message: 'Which network should be the default?',
        choices: [
          { title: 'Testnet (recommended for development)', value: 'testnet' },
          { title: 'Mainnet', value: 'mainnet' },
        ],
        initial: 0,
      });
    }

    // Always ask about installation and git
    questions.push(
      {
        type: 'confirm',
        name: 'installDeps',
        message: 'Install dependencies?',
        initial: true,
      },
      {
        type: 'confirm',
        name: 'initGit',
        message: 'Initialize a git repository?',
        initial: true,
      }
    );

    const answers = await prompts(questions, {
      onCancel: () => {
        console.log(pc.red('\n✖ Operation cancelled'));
        process.exit(0);
      },
    });

    return {
      projectName: projectName || answers.projectName,
      walletConnectId: walletConnectId || answers.walletConnectId || undefined,
      network: network || answers.network,
      installDeps: answers.installDeps,
      initGit: answers.initGit,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(pc.red('Error during prompts:'), message);
    return null;
  }
}
