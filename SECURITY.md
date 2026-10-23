# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Security Model & Zero-Trust Boundary

`household-covenant-schema` is a zero-runtime-dependency TypeScript contract library (relying solely on Zod). It executes strictly in-memory:
- Zero outbound network calls
- Zero persistent storage access
- Zero credential requirements
- Pure AST and schema validation

## Reporting a Vulnerability

Please do not report security vulnerabilities through public GitHub issues.

1. Submit reports privately via [GitHub Security Advisories](https://github.com/sivasubramanian86/household-covenant-schema/security/advisories/new).
2. If GitHub Advisories are unavailable, contact the project maintainer privately via GitHub profile [@sivasubramanian86](https://github.com/sivasubramanian86).
3. Include a minimal reproducible test case.
4. Maintainers will acknowledge receipt within 48 hours and provide a coordinated remediation release.
