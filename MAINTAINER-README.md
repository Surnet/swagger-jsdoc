# swagger-jsdoc - Maintainer Guide

A comprehensive guide for maintaining the swagger-jsdoc project, covering codebase architecture, workflows, contribution processes, and deployment procedures.

## Project Overview

**swagger-jsdoc** is a Node.js library that generates OpenAPI (Swagger) specifications from JSDoc-annotated source code. It supports OpenAPI 3.x, Swagger 2.0, and AsyncAPI 2.0 specifications.

- **Current Version**: 6.1.0
- **License**: MIT
- **Repository**: https://github.com/Surnet/swagger-jsdoc
- **Main Branch**: master
- **Node.js Support**: >=12.0.0

## Repository Structure

```
swagger-jsdoc/
├── src/                    # Core source code
│   ├── lib.js             # Main entry point and validation
│   ├── specification.js   # Core specification building logic
│   └── utils.js           # Utility functions (file parsing, glob handling)
├── bin/                   # CLI tool
│   └── swagger-jsdoc.js   # Command-line interface
├── examples/              # Example implementations
│   ├── app/               # Basic Express.js example
│   ├── eventDriven/       # AsyncAPI example
│   ├── extensions/        # Extension examples
│   └── yaml-anchors-aliases/ # YAML anchors example
├── test/                  # Test suite
│   ├── __snapshots__/     # Jest snapshots
│   ├── files/            # Test fixtures
│   └── fixtures/         # Additional test data
├── docs/                  # Documentation
├── docusaurus/           # Documentation website
├── .github/              # GitHub workflows and templates
│   ├── workflows/        # CI/CD workflows
│   ├── ISSUE_TEMPLATE/   # Issue templates
│   └── dependabot.yml   # Dependency management
├── index.js              # Package entry point (exports src/lib.js)
├── package.json          # Package configuration
└── README.md             # User documentation
```

## Core Architecture

### Main Components

1. **lib.js** (`src/lib.js`)
   - Main API entry point
   - Input validation
   - Options processing
   - Delegates to specification.js for building

2. **specification.js** (`src/specification.js`)
   - Core specification building logic
   - Handles multiple API spec formats (OpenAPI 3.x, Swagger 2.0, AsyncAPI 2.0)
   - YAML parsing and processing
   - Error handling and reporting
   - Key functions:
     - `prepare()`: Initializes specification skeleton
     - `build()`: Main building orchestrator
     - `organize()`: Organizes parsed annotations
     - `finalize()`: Validates and formats output

3. **utils.js** (`src/utils.js`)
   - File system utilities
   - Glob pattern expansion
   - Annotation extraction from source files
   - YAML processing helpers
   - Support for .js, .coffee, .yml, .yaml files

4. **CLI Tool** (`bin/swagger-jsdoc.js`)
   - Command-line interface
   - File input/output handling
   - Definition file loading
   - JSON/YAML output formatting

### Data Flow

1. **Input Processing**: Options validation → API files discovery (glob patterns) → File content reading
2. **Parsing**: JSDoc comment extraction → YAML parsing → Annotation processing
3. **Building**: Specification skeleton creation → Annotation organization → Schema merging
4. **Output**: Validation → Format conversion → Result delivery

## Dependencies

### Production Dependencies
- `commander`: CLI argument parsing
- `doctrine`: JSDoc parsing
- `glob`: File pattern matching
- `lodash.mergewith`: Object deep merging
- `swagger-parser`: OpenAPI validation
- `yaml`: YAML parsing and stringification

### Development Dependencies
- `eslint`: Code linting
- `jest`: Testing framework
- `express`: Example app server
- `prettier`: Code formatting
- `husky`: Git hooks
- `lint-staged`: Pre-commit linting

## Development Workflow

### Code Quality Tools

1. **Linting**: ESLint with Airbnb base configuration
   ```bash
   npm run lint
   ```

2. **Testing**: Jest with verbose output
   ```bash
   npm run test
   npm run test:js  # JS tests only
   ```

3. **Pre-commit Hooks**: Husky + lint-staged
   - Automatically formats code with Prettier
   - Runs on all staged `.js`, `.json`, `.md`, `.yml`, `.yaml` files

### Git Workflow

1. **Branch Strategy**: Feature branches from `master`
2. **Commit Convention**: Uses conventional commits
3. **Pre-commit**: Automatic formatting and linting
4. **Merge Strategy**: Squash and merge for PRs

## CI/CD Pipeline

### GitHub Actions (`.github/workflows/ci.yml`)

The CI pipeline runs on all pushes and pull requests:

1. **Audit Job**
   - Security vulnerability scanning
   - `yarn audit`

2. **Tests Job**
   - Node.js versions: 12.x, 14.x
   - Install dependencies with frozen lockfile
   - Run full test suite (`yarn test`)

3. **Publish Job** (master branch only)
   - Automatic publishing via `mikeal/merge-release`
   - Requires: `GITHUB_TOKEN` and `NPM_AUTH_TOKEN` secrets
   - Publishes to NPM on successful tests

### Dependency Management

**Dependabot** (`.github/dependabot.yml`):
- Daily dependency updates
- Yarn package ecosystem
- Conventional commit prefixes:
  - `fix: ` for regular dependencies
  - `fix(dev-deps): ` for dev dependencies

## Pull Request Process

### For Contributors

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR-USERNAME/swagger-jsdoc.git
   cd swagger-jsdoc
   yarn install
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Development**
   - Write code following existing patterns
   - Add tests for new functionality
   - Ensure all tests pass: `yarn test`
   - Ensure linting passes: `yarn lint`

4. **Commit and Push**
   - Commits are automatically formatted by pre-commit hooks
   - Use conventional commit messages
   - Push branch and create PR

### For Maintainers

1. **Review Checklist**
   - [ ] Code follows existing patterns and conventions
   - [ ] Tests added for new functionality
   - [ ] Documentation updated if needed
   - [ ] No security vulnerabilities introduced
   - [ ] CI checks pass
   - [ ] Breaking changes are clearly documented

2. **Merging**
   - Use "Squash and merge" for most PRs
   - Write clear merge commit messages
   - Delete feature branch after merge

## Release Process

### Automated Release (Recommended)

The project uses `mikeal/merge-release` for automated releases:

1. **Merge PR to master**
2. **CI automatically**:
   - Analyzes commit messages for semantic versioning
   - Bumps version in package.json
   - Creates GitHub release
   - Publishes to NPM
   - Updates CHANGELOG.md

### Manual Release (Emergency Only)

If automation fails:

1. **Version Bump**
   ```bash
   npm version patch|minor|major
   ```

2. **Publish**
   ```bash
   npm publish
   ```

3. **Create GitHub Release**
   - Tag: matches NPM version
   - Release notes: summarize changes

## Issue Management

### Issue Categories

1. **Security Vulnerabilities** (Priority: Critical)
   - Check recent issues #426, #425
   - YAML dependency CVE-2023-2251 (#377)
   - Update vulnerable dependencies immediately

2. **Feature Requests** (Priority: Medium)
   - CLI error flag (#370)
   - New functionality proposals

3. **Bug Reports** (Priority: High)
   - Memory leaks (#429)
   - Production issues (#379)

### Triage Process

1. **Label appropriately**: bug, enhancement, documentation, security
2. **Assign priority**: critical, high, medium, low
3. **Pin important issues** for visibility
4. **Close stale issues** using GitHub stale bot

## Security Considerations

### Current Security Issues

1. **Dependency Vulnerabilities**
   - Validator package vulnerabilities (PR #428)
   - YAML CVE-2023-2251 (Issue #377)
   - Regular dependency audits needed

2. **Best Practices**
   - Never log or expose secrets in generated documentation
   - Validate all user inputs
   - Use latest versions of security-critical dependencies
   - Regular security audits

## Testing Strategy

### Test Structure
- Unit tests: `test/*.spec.js`
- Fixtures: `test/files/` and `test/fixtures/`
- Snapshots: `test/__snapshots__/`

### Coverage
- Aim for >90% test coverage
- Focus on core functionality in `src/`
- CLI testing with snapshots

### Running Tests
```bash
yarn test          # Full test suite
yarn test:js       # Jest tests only
yarn test:lint     # Linting only
```

## Common Maintenance Tasks

### 1. Dependency Updates
```bash
yarn upgrade-interactive
# Review and test changes
yarn test
```

### 2. Security Audits
```bash
yarn audit
# Fix high/critical vulnerabilities immediately
yarn audit --fix
```

### 3. Documentation Updates
- Update version-specific docs in `docusaurus/versioned_docs/`
- Keep examples in `examples/` current
- Update README for breaking changes

### 4. Performance Monitoring
- Watch for memory leak reports
- Monitor parsing performance with large codebases
- Optimize glob pattern matching if needed

## Documentation Maintenance

### Documentation Website (Docusaurus)
- Source: `docusaurus/`
- Versions: `docusaurus/versioned_docs/`
- Build: `cd docusaurus && yarn build`
- Deploy: Handled by separate workflow

### Version Documentation
- Current: 6.x in `docusaurus/versioned_docs/version-6.x/`
- Legacy: 5.x and 7.x versions maintained
- Update docs for breaking changes

## Emergency Procedures

### Security Vulnerability Response

1. **Immediate Actions**
   - Assess severity and impact
   - Create private security advisory if critical
   - Prepare patch quickly

2. **Patching Process**
   - Create security branch
   - Implement minimal fix
   - Test thoroughly
   - Release emergency patch
   - Coordinate disclosure

### Production Issues

1. **User Reports**: Monitor GitHub issues for production problems
2. **Quick Diagnosis**: Use examples/ to reproduce issues
3. **Hotfix Process**: Emergency patch release if critical

## Future Roadmap Considerations

### Technical Debt
- Node.js 12.x is approaching EOL - plan upgrade
- Consider TypeScript migration for better DX
- Evaluate alternative YAML parsers for security

### Feature Enhancements
- Better error messages and debugging
- Plugin system for custom processors
- IDE integration improvements
- Performance optimizations for large codebases

## Contacts and Resources

### Key Maintainers
- Check GitHub contributors graph for active maintainers
- Review commit history for current active developers

### External Resources
- OpenAPI Specification: https://swagger.io/specification/
- JSDoc Documentation: https://jsdoc.app/
- AsyncAPI Specification: https://www.asyncapi.com/

---

*Last Updated: November 2024*
*This guide should be reviewed quarterly and updated as the project evolves.*