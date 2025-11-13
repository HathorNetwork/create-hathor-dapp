# Publishing create-hathor-dapp to npm

This guide walks you through publishing the CLI tool to npm.

## Prerequisites

1. **npm account**: Create one at [https://www.npmjs.com/signup](https://www.npmjs.com/signup)
2. **npm login**: Run `npm login` and authenticate

## Pre-Publishing Checklist

- [ ] Update version in `package.json`
- [ ] Test the CLI locally with `npm link`
- [ ] Ensure all dependencies are correct
- [ ] Review `.npmignore` to exclude unnecessary files
- [ ] Build the package: `npm run build`
- [ ] Test the build: Create a test project with the built CLI

## Publishing Steps

### 1. Update Version

Follow [Semantic Versioning](https://semver.org/):

```bash
# For patches (bug fixes)
npm version patch  # 1.0.0 -> 1.0.1

# For minor releases (new features)
npm version minor  # 1.0.0 -> 1.1.0

# For major releases (breaking changes)
npm version major  # 1.0.0 -> 2.0.0
```

### 2. Test Locally

```bash
# Build the package
npm run build

# Test it locally
npm link
create-hathor-dapp test-app --yes
cd test-app && npm install && npm run dev
```

### 3. Publish to npm

```bash
# Dry run to see what will be published
npm publish --dry-run

# Publish for real
npm publish
```

### 4. Verify Publication

```bash
# Test installing from npm
npx create-hathor-dapp@latest test-app --yes
```

## Package Scope Options

### Option 1: Unscoped Package (Requires Available Name)

Current configuration: `create-hathor-dapp`

```json
{
  "name": "create-hathor-dapp"
}
```

### Option 2: Scoped Package (Recommended)

Use your npm username or organization:

```json
{
  "name": "@your-org/create-hathor-dapp"
}
```

Then publish with:

```bash
npm publish --access public
```

## Continuous Updates

### After Publishing

1. **Test the published package**:
   ```bash
   npx create-hathor-dapp@latest my-test --yes
   ```

2. **Monitor for issues**: Watch npm downloads and GitHub issues

3. **Regular updates**: Keep dependencies up to date

### Version History Best Practices

- Maintain a CHANGELOG.md
- Use git tags for versions
- Write clear commit messages

## Common Issues

### Error: Package name already exists

**Solution**: Use a scoped package name `@your-org/create-hathor-dapp`

### Error: 402 Payment Required

**Solution**: Scoped packages require `--access public` flag for free accounts

### Error: Not logged in

**Solution**: Run `npm login` first

## Unpublishing (Emergency Only)

⚠️ **Warning**: npm has strict unpublish policies. Only use within 72 hours of publishing.

```bash
npm unpublish create-hathor-dapp@1.0.0
```

## Beta/Alpha Releases

For testing before stable release:

```bash
# Publish as beta
npm version prerelease --preid=beta  # 1.0.0-beta.0
npm publish --tag beta

# Users install with
npx create-hathor-dapp@beta my-app
```

## Automation with GitHub Actions

Consider setting up automated publishing:

```yaml
# .github/workflows/publish.yml
name: Publish to npm
on:
  release:
    types: [created]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Support and Updates

- Keep the README.md updated with latest features
- Respond to issues on GitHub
- Monitor npm for deprecated dependencies
- Regular security updates

---

**Ready to publish?** Follow the steps above and you'll have your CLI on npm! 🚀
