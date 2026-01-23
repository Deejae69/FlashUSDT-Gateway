# Contributing to FlashUSDT-Gateway

Thank you for your interest in contributing to FlashUSDT-Gateway! This document provides guidelines for contributing to the project.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Code Standards](#code-standards)
5. [Naming Conventions](#naming-conventions)
6. [Testing Requirements](#testing-requirements)
7. [Pull Request Process](#pull-request-process)
8. [Security](#security)

---

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior
- Use clear, descriptive language in code and communication
- Be respectful of differing viewpoints and experiences
- Focus on what is best for the community and project
- Show empathy towards other community members

---

## Getting Started

### Prerequisites
- Familiarity with blockchain technology and cryptocurrency transactions
- Understanding of TRC20, ERC20, BEP20, BTC, and Fantom networks
- Experience with relevant programming languages (to be determined based on implementation)

### Development Setup
1. Fork the repository
2. Clone your fork locally
3. Install dependencies (specific instructions to be added)
4. Create a feature branch from `main`

```bash
git clone https://github.com/YOUR_USERNAME/FlashUSDT-Gateway.git
cd FlashUSDT-Gateway
git checkout -b feature/descriptive-feature-name
```

---

## Development Workflow

### Branch Naming
Use descriptive branch names that indicate the purpose:
- `feature/add-trc20-transfer-support`
- `bugfix/fix-wallet-connection-timeout`
- `enhancement/improve-transaction-validation`
- `docs/update-api-documentation`

### Commit Messages
Write clear, descriptive commit messages:

✅ Good:
```
Add TRC20 transaction validation with address format check

- Implement validateTrc20Address function
- Add regex pattern for Tron address validation
- Include unit tests for edge cases
```

❌ Bad:
```
fix stuff
update code
changes
```

---

## Code Standards

### General Principles
1. **Readability First**: Code is read more often than written
2. **Explicit Over Implicit**: Make intentions clear
3. **Fail Fast**: Validate inputs early and provide clear error messages
4. **Don't Repeat Yourself (DRY)**: Extract common functionality
5. **Security First**: Always validate and sanitize user inputs

### Code Formatting
- Use consistent indentation (2 or 4 spaces, depending on language)
- Maximum line length: 100 characters
- Use meaningful whitespace to improve readability
- Follow language-specific style guides

---

## Naming Conventions

**This is critical for code quality.** Please refer to [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md) for detailed guidelines.

### Quick Reference

#### Variables
```javascript
// ❌ Bad
let amt = 1000;
let addr = "TRC20...";
let tx = await send();

// ✅ Good
let transferAmountUsdt = 1000;
let recipientWalletAddress = "TRC20...";
let transactionReceipt = await sendTransaction();
```

#### Functions
```javascript
// ❌ Bad
function send(a, b) { }
function check(x) { }

// ✅ Good
function sendUsdtTransaction(senderAddress, recipientAddress) { }
function validateTransactionAmount(amountInUsdt) { }
```

#### Classes
```javascript
// ✅ Use PascalCase and descriptive names
class TransactionManager { }
class WalletConnectionService { }
class NetworkFeeCalculator { }
```

---

## Testing Requirements

### Test Coverage
- All new features must include unit tests
- Critical paths require integration tests
- Aim for >80% code coverage

### Test Naming
Use descriptive test names that explain the scenario:

```javascript
// ✅ Good test names
describe('TransactionValidator', () => {
  it('should reject transactions with negative amounts', () => { });
  it('should accept valid TRC20 wallet addresses', () => { });
  it('should throw InsufficientBalanceError when balance is too low', () => { });
});

// ❌ Bad test names
describe('Validator', () => {
  it('test1', () => { });
  it('works', () => { });
});
```

### Test File Structure
```
src/
  transaction-manager.js
  transaction-manager.test.js
  wallet-connector.js
  wallet-connector.test.js
```

---

## Pull Request Process

### Before Submitting
- [ ] Code follows naming conventions (see NAMING_CONVENTIONS.md)
- [ ] All tests pass
- [ ] New tests added for new functionality
- [ ] Documentation updated if needed
- [ ] No console.log or debug statements left in code
- [ ] Security considerations addressed
- [ ] Code has been self-reviewed

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Specific change 1
- Specific change 2

## Testing
- How has this been tested?
- What test cases were added?

## Screenshots (if applicable)

## Checklist
- [ ] Follows naming conventions
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process
1. Automated checks must pass
2. Code review by at least one maintainer
3. All feedback addressed
4. Final approval from maintainer

---

## Security

### Security-First Development

#### Input Validation
Always validate and sanitize inputs:
```javascript
function transferUsdt(recipientAddress, transferAmount) {
  // ✅ Validate inputs first
  if (!isValidAddress(recipientAddress)) {
    throw new InvalidWalletAddressError('Recipient address format is invalid');
  }
  
  if (transferAmount <= 0) {
    throw new InvalidAmountError('Transfer amount must be positive');
  }
  
  if (transferAmount > maxTransactionLimit) {
    throw new AmountExceedsLimitError(`Amount exceeds maximum limit of ${maxTransactionLimit}`);
  }
  
  // Proceed with transfer
}
```

#### Private Key Handling
```javascript
// ✅ Never log or expose private keys
function signTransaction(transactionData, privateKey) {
  // Never: console.log(privateKey)
  // Never: throw new Error(`Failed with key: ${privateKey}`)
  
  try {
    return cryptoSign(transactionData, privateKey);
  } catch (error) {
    // ✅ Log error without exposing sensitive data
    throw new SigningError('Transaction signing failed');
  }
}
```

#### Error Messages
```javascript
// ❌ Exposes sensitive information
throw new Error(`Authentication failed for user ${username} with password ${password}`);

// ✅ Generic but useful error
throw new AuthenticationError('Invalid credentials provided');
```

### Reporting Security Issues
**Do not** open public issues for security vulnerabilities. Instead:
1. Contact the maintainers privately via Telegram: [@flashbyMiguel](https://t.me/flashbyMiguel)
2. Provide detailed description of the vulnerability
3. Include steps to reproduce if applicable
4. Allow time for the issue to be addressed before public disclosure

---

## Code Review Checklist

When reviewing code or self-reviewing before submission:

### Naming & Readability
- [ ] Variable names clearly describe their purpose
- [ ] Function names start with action verbs and describe what they do
- [ ] Class names are nouns that represent their responsibility
- [ ] Constants use SCREAMING_SNAKE_CASE with descriptive names
- [ ] No single-letter variables (except loop counters)
- [ ] No abbreviations that aren't universally understood

### Functionality
- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled
- [ ] Error handling is comprehensive
- [ ] No code duplication
- [ ] Functions have single responsibility

### Security
- [ ] Input validation is present
- [ ] No hardcoded credentials or sensitive data
- [ ] Error messages don't expose sensitive information
- [ ] External data is sanitized
- [ ] Authentication/authorization checks in place

### Testing
- [ ] Unit tests cover new functionality
- [ ] Tests are meaningful and not just for coverage
- [ ] Test names clearly describe what they test
- [ ] Tests are independent and repeatable

### Documentation
- [ ] Complex logic is commented (explaining why, not what)
- [ ] Public APIs are documented
- [ ] README updated if needed
- [ ] Breaking changes are clearly documented

---

## Style Guide References

### Language-Specific Guides
When contributing code, follow these style guides:

- **JavaScript/TypeScript**: [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- **Python**: [PEP 8 – Style Guide for Python Code](https://pep8.org/)
- **Solidity**: [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- **Go**: [Effective Go](https://golang.org/doc/effective_go)

---

## Examples of Good vs Bad Code

### Example 1: Transaction Processing

#### ❌ Bad
```javascript
function process(from, to, amt) {
  let f = calc(amt);
  let r = send(from, to, amt - f);
  return r;
}
```

#### ✅ Good
```javascript
function processUsdtTransfer(senderAddress, recipientAddress, transferAmountUsdt) {
  const networkFeeUsdt = calculateTransactionFee(transferAmountUsdt);
  const netTransferAmount = transferAmountUsdt - networkFeeUsdt;
  
  const transactionReceipt = sendUsdtTransaction(
    senderAddress, 
    recipientAddress, 
    netTransferAmount
  );
  
  return transactionReceipt;
}
```

### Example 2: Validation

#### ❌ Bad
```javascript
function check(addr) {
  return addr.length === 34 && addr[0] === 'T';
}
```

#### ✅ Good
```javascript
function isValidTrc20Address(walletAddress) {
  const TRC20_ADDRESS_LENGTH = 34;
  const TRC20_ADDRESS_PREFIX = 'T';
  
  if (!walletAddress || typeof walletAddress !== 'string') {
    return false;
  }
  
  return walletAddress.length === TRC20_ADDRESS_LENGTH && 
         walletAddress.startsWith(TRC20_ADDRESS_PREFIX);
}
```

---

## Questions?

If you have questions about contributing:
1. Check existing documentation
2. Search closed issues and PRs
3. Open a discussion issue
4. Contact maintainers via Telegram: [@flashbyMiguel](https://t.me/flashbyMiguel)

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see [LICENSE](./LICENSE)).

---

Thank you for contributing to FlashUSDT-Gateway! 🚀
