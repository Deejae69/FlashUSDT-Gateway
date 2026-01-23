# Naming Conventions for FlashUSDT-Gateway

## Overview
This document outlines the naming conventions to be followed when developing code for the FlashUSDT-Gateway project. Using descriptive, clear, and consistent names improves code readability, maintainability, and collaboration.

---

## General Principles

### 1. Be Descriptive and Clear
- Names should clearly convey the purpose and intent
- Avoid single-letter variables except for loop counters
- Prefer longer, descriptive names over short, cryptic abbreviations

### 2. Use Consistent Patterns
- Follow language-specific conventions (camelCase, snake_case, PascalCase)
- Use consistent prefixes/suffixes for related functionality
- Group related functions with common prefixes

### 3. Avoid Ambiguity
- Names should have one clear meaning
- Avoid generic names like `data`, `info`, `temp`, `value`
- Use domain-specific terminology appropriately

---

## Variable Naming

### ❌ Poor Examples
```javascript
let a = 1000;
let amt = getBalance();
let temp = calculateFee();
let x = await sendTx();
```

### ✅ Good Examples
```javascript
let minimumTransactionAmount = 1000;
let currentWalletBalance = getBalance();
let calculatedNetworkFee = calculateFee();
let transactionReceipt = await sendTransaction();
```

### Guidelines
- **Network Identifiers**: Use full network names
  - ✅ `trc20Address`, `erc20TokenBalance`, `bep20ContractAddress`
  - ❌ `addr`, `bal`, `contract`

- **Transaction Variables**: Be explicit about transaction properties
  - ✅ `transactionHash`, `confirmationCount`, `gasEstimate`
  - ❌ `hash`, `confirms`, `gas`

- **Amounts and Values**: Specify currency and units
  - ✅ `usdtAmountInWei`, `transferAmountInUsdt`, `feeInNativeToken`
  - ❌ `amount`, `value`, `fee`

- **Wallet Variables**: Clarify wallet context
  - ✅ `senderWalletAddress`, `recipientPublicKey`, `userPrivateKey`
  - ❌ `from`, `to`, `key`

---

## Function Naming

### ❌ Poor Examples
```javascript
function send(addr, amt) { }
function get() { }
function check(x) { }
function validate(data) { }
```

### ✅ Good Examples
```javascript
function sendUsdtTransaction(recipientAddress, transferAmount) { }
function getCurrentWalletBalance() { }
function checkTransactionConfirmation(transactionHash) { }
function validateWalletAddressFormat(walletAddress) { }
```

### Guidelines
- **Action Verbs**: Start with clear action verbs
  - `get`, `set`, `calculate`, `validate`, `send`, `receive`, `verify`
  
- **Network Operations**: Include network context
  - ✅ `transferUsdtOnTrc20()`, `getErc20TokenBalance()`, `estimateBep20GasFee()`
  - ❌ `transfer()`, `getBalance()`, `estimate()`

- **Validation Functions**: Be specific about what's validated
  - ✅ `validateTrc20Address()`, `isValidTransactionAmount()`, `verifySignature()`
  - ❌ `validate()`, `isValid()`, `verify()`

- **Async Functions**: Make async nature clear when needed
  - ✅ `fetchTransactionReceipt()`, `awaitConfirmation()`, `queryBlockchainState()`
  - Use appropriate verbs that imply async: `fetch`, `await`, `query`, `request`

---

## Class and Interface Naming

### ✅ Good Examples
```javascript
class TransactionManager { }
class WalletConnector { }
class NetworkFeeCalculator { }
class UsdtTransferService { }

interface IBlockchainProvider { }
interface IWalletAdapter { }
interface ITransactionValidator { }
```

### Guidelines
- Use PascalCase for class names
- Names should be nouns or noun phrases
- Interfaces can be prefixed with `I` (language-dependent)
- Service classes should end with `Service`, `Manager`, `Handler`, or `Controller`

---

## Constant Naming

### ✅ Good Examples
```javascript
const MAXIMUM_TRANSACTION_AMOUNT_USDT = 10000;
const MINIMUM_CONFIRMATION_BLOCKS = 12;
const DEFAULT_GAS_LIMIT = 21000;
const SUPPORTED_NETWORK_TYPES = ['TRC20', 'ERC20', 'BEP20', 'BTC', 'Fantom'];
const TRANSACTION_VALIDITY_DAYS = 51;
```

### Guidelines
- Use SCREAMING_SNAKE_CASE for constants
- Be explicit about units and limits
- Include context in the name

---

## Network-Specific Conventions

### TRC20 (Tron)
```javascript
const trc20ContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
function transferTrc20Usdt(fromAddress, toAddress, amountInSun) { }
function getTrc20TransactionEnergy(transactionData) { }
```

### ERC20 (Ethereum)
```javascript
const erc20TokenContractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';
function transferErc20Token(fromWallet, toWallet, amountInWei) { }
function estimateErc20GasCost(transactionParameters) { }
```

### BEP20 (Binance Smart Chain)
```javascript
const bep20TokenAddress = '0x55d398326f99059fF775485246999027B3197955';
function sendBep20Transaction(senderAddress, recipientAddress, tokenAmount) { }
function calculateBep20TransactionFee(gasPrice, gasLimit) { }
```

### BTC (Bitcoin)
```javascript
const bitcoinWalletAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
function createBitcoinTransaction(inputUtxos, outputAddresses, amounts) { }
function estimateBitcoinNetworkFee(transactionSize) { }
```

---

## File Naming

### Guidelines
- Use kebab-case for file names: `transaction-manager.js`
- Test files: `transaction-manager.test.js`
- Configuration files: `network-config.json`
- Be descriptive about the file's purpose

### Examples
```
wallet-connector.js
usdt-transfer-service.js
network-fee-calculator.js
transaction-validator.js
blockchain-provider.js
```

---

## Error Handling

### ✅ Good Examples
```javascript
class InsufficientBalanceError extends Error { }
class InvalidWalletAddressError extends Error { }
class TransactionTimeoutError extends Error { }
class NetworkConnectionError extends Error { }

try {
  await sendTransaction();
} catch (error) {
  if (error instanceof InsufficientBalanceError) {
    handleInsufficientBalance(error);
  }
}
```

---

## Comments and Documentation

### Use Descriptive Names Instead of Comments
❌ Bad:
```javascript
// Check if amount is greater than 0
if (amt > 0) { }
```

✅ Good:
```javascript
if (transferAmount > 0) { }
```

### When Comments Are Needed
Use them to explain "why" not "what":
```javascript
// Apply 51-day validity period to ensure security while maintaining flexibility
const transactionExpirationDays = 51;
```

---

## Summary Checklist

When naming any code element, ask yourself:
- [ ] Does the name clearly describe what it represents?
- [ ] Would another developer understand this without context?
- [ ] Does it follow the language's naming conventions?
- [ ] Is it specific enough to avoid ambiguity?
- [ ] Does it use domain terminology appropriately?
- [ ] Is it consistent with similar names in the codebase?

---

## References

For language-specific conventions, also refer to:
- JavaScript/TypeScript: [Airbnb Style Guide](https://github.com/airbnb/javascript)
- Python: [PEP 8](https://pep8.org/)
- Solidity: [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Go: [Effective Go](https://golang.org/doc/effective_go)
