# create-hathor-dapp

A CLI tool to scaffold new Hathor dApp projects with one command. Built with TypeScript, featuring both interactive and non-interactive modes.

## Usage

### Interactive Mode

```bash
npx create-hathor-dapp
```

The CLI will prompt you for:
- Project name
- WalletConnect Project ID (optional)
- Default network (testnet/mainnet)
- Whether to install dependencies
- Whether to initialize git repository

### Non-Interactive Mode

Perfect for automation and LLM usage:

```bash
npx create-hathor-dapp my-app --yes --wallet-connect-id=YOUR_ID --network=testnet
```

## Command Line Options

```
Usage: create-hathor-dapp [options] [project-name]

Create a new Hathor dApp project

Arguments:
  project-name              Name of the project

Options:
  -V, --version             output the version number
  -y, --yes                 Skip prompts and use defaults (non-interactive mode)
  --wallet-connect-id <id>  WalletConnect Project ID
  --network <network>       Default network (testnet or mainnet) (default: "testnet")
  --skip-install            Skip dependency installation
  --skip-git                Skip git initialization
  -h, --help                display help for command
```

## Examples

### Create a project with all defaults (interactive)

```bash
npx create-hathor-dapp my-dapp
```

### Create a project fully configured (non-interactive)

```bash
npx create-hathor-dapp my-dapp \
  --yes \
  --wallet-connect-id=8264fff563181da658ce64ee80e80458 \
  --network=testnet
```

### Create without installing dependencies

```bash
npx create-hathor-dapp my-dapp --yes --skip-install
```

### Create without git initialization

```bash
npx create-hathor-dapp my-dapp --yes --skip-git
```

## What Gets Created

The CLI scaffolds a complete Next.js 14 dApp with:

- **Wallet Integration**: WalletConnect (Reown) and MetaMask Snaps
- **Type Safety**: Full TypeScript support
- **Context System**: React contexts for wallet and Hathor network management
- **UI Components**: Pre-built components using Tailwind CSS
- **Documentation**: Complete guides for quick start and contract integration
- **Configuration**: Environment variables pre-configured for your chosen network

### Project Structure

```
my-app/
├── app/                    # Next.js App Router pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── contexts/             # React contexts
│   ├── HathorContext.tsx
│   ├── WalletContext.tsx
│   ├── WalletConnectContext.tsx
│   └── MetaMaskContext.tsx
├── lib/                  # Utility libraries
│   ├── hathorCoreAPI.ts
│   ├── hathorRPC.ts
│   └── config.ts
├── types/               # TypeScript type definitions
├── public/              # Static assets
├── .env.local          # Environment configuration
├── README.md           # Project documentation
├── QUICKSTART.md       # Quick start guide
└── CONTRACT_INTEGRATION.md  # Contract integration guide
```

## Configuration

### Environment Variables

The CLI creates a `.env.local` file with:

```env
# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Network Configuration
NEXT_PUBLIC_HATHOR_NETWORK=testnet  # or mainnet

# Development Mode (optional)
NEXT_PUBLIC_USE_MOCK_WALLET=false
```

### Getting a WalletConnect Project ID

1. Visit [https://cloud.reown.com/](https://cloud.reown.com/)
2. Create a free account
3. Create a new project
4. Copy your Project ID
5. Add it to `.env.local` or use `--wallet-connect-id` flag

## Development

### Building the CLI

```bash
npm install
npm run build
```

### Testing Locally

```bash
# Link the package
npm link

# Test it
create-hathor-dapp test-app --yes
```

## Package Manager Detection

The CLI automatically detects your preferred package manager:

1. **pnpm** (highest priority)
2. **yarn**
3. **npm** (fallback)

It uses the detected package manager for installation and shows the appropriate commands in the output.

## Security Features

- **Path Traversal Protection**: Validates project names to prevent `../` attacks
- **Input Validation**: All user inputs are validated before use
- **Type Safety**: Full TypeScript for compile-time safety
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Error Handling

The CLI gracefully handles common errors:

- **Directory exists**: Won't overwrite existing projects
- **Git not configured**: Provides helpful setup instructions
- **Network issues**: Continues with manual installation instructions
- **Invalid inputs**: Clear validation messages

## Requirements

- Node.js >= 18.0.0
- npm, yarn, or pnpm

## Contributing

The CLI is part of the Hathor dApp Template ecosystem. Issues and contributions are welcome!

## License

MIT

---

Built with ❤️ for the Hathor Network community
