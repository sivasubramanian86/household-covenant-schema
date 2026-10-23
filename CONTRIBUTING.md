# Contributing to household-covenant-schema

Thank you for your interest in contributing to `household-covenant-schema`! This library provides deterministic TypeScript contracts and replay verification for household agreements and Alexa+ MCP Add-ons.

## Development Setup

Requirements:
- Node.js >= 20.19.0
- npm >= 10.0.0

```sh
git clone https://github.com/sivasubramanian86/household-covenant-schema.git
cd household-covenant-schema
npm install
npm test
npm run build
```

## Quality Gates

Before opening a pull request, ensure:
1. `npm test` passes 100% of unit tests.
2. `npm run build` succeeds without TypeScript type errors (`tsc -p tsconfig.json`).
3. No external runtime dependencies beyond `zod` are introduced.
4. Conventional commit messages (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`) are used.

## Pull Request Process

1. Fork the repository and create your feature branch: `git checkout -b feat/my-covenant-rule`.
2. Implement your changes with corresponding test coverage in `src/index.test.ts`.
3. Submit a pull request describing the motivation, test evidence, and any contract impacts.
