# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by:

1. **DO NOT** open a public GitHub issue
2. Email the maintainers directly (if applicable)
3. Provide detailed information about the vulnerability
4. Allow reasonable time for the issue to be addressed before public disclosure

## Security Best Practices

This project follows these security practices:

- All sensitive data (API tokens) are stored in environment variables
- Dependencies are regularly updated to patch security vulnerabilities
- No secrets are committed to the repository
- All API calls use HTTPS endpoints

## Environment Variables

Ensure your `.env` file is properly configured:

```bash
# Required API token for GoRest API
GOREST_TOKEN=your_actual_token_here
```

**Important**: Never commit your actual `.env` file to version control.

## Dependency Security

To check for security vulnerabilities in dependencies:

```bash
npm audit
npm audit fix
```

## Secure Token Management

- API tokens should have minimal required permissions
- Rotate tokens regularly
- Use different tokens for different environments (dev/staging/prod)
- Never share tokens in chat, email, or documentation
