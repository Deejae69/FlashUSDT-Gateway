# Code Examples with Descriptive Naming

This directory contains example code files that demonstrate proper naming conventions for the FlashUSDT-Gateway project. These examples serve as templates for writing clean, maintainable code with descriptive variable and function names.

---

## 📁 Files in This Directory

### 1. `transaction-manager.js` (JavaScript)
Demonstrates a complete transaction management system with:
- **Descriptive constants** using SCREAMING_SNAKE_CASE
- **Clear function names** that explain their purpose
- **Meaningful variable names** throughout
- **Custom error classes** with specific, descriptive names
- **Comprehensive documentation** via JSDoc comments

**Key Features:**
- Transaction validation and processing
- Network-specific address validation (TRC20, ERC20, BEP20, BTC, Fantom)
- Fee calculation with clear variable names
- Transaction confirmation monitoring
- Error handling with descriptive exception types

### 2. `wallet_service.py` (Python)
Demonstrates wallet management functionality with:
- **Descriptive function names** following Python conventions (snake_case)
- **Type hints** for better code clarity
- **Enum classes** for network types, transaction status, and wallet types
- **Custom exception classes** with meaningful names
- **Comprehensive docstrings** for all functions

**Key Features:**
- Wallet connection management
- Balance checking with caching
- Transaction history retrieval
- Wallet data export
- Network-specific address validation

---

## 🎯 Purpose of These Examples

### Before Writing Code
1. **Review these examples** to understand naming conventions
2. **Use them as templates** when creating new modules
3. **Reference the patterns** for consistency

### Learning Points

#### ❌ What NOT to Do
```javascript
// Poor naming - avoid this
function send(addr, amt) {
  let f = calc(amt);
  let tx = process(addr, amt - f);
  return tx;
}

let a = "TR7...";
let b = 100;
let c = send(a, b);
```

#### ✅ What TO Do
```javascript
// Good naming - follow this pattern
function sendUsdtTransaction(recipientAddress, transferAmountUsdt) {
  const networkFeeUsdt = calculateTransactionFee(transferAmountUsdt);
  const netTransferAmount = transferAmountUsdt - networkFeeUsdt;
  const transactionReceipt = processTransaction(recipientAddress, netTransferAmount);
  return transactionReceipt;
}

const recipientTrc20Address = "TR7...";
const transferAmountUsdt = 100;
const transactionReceipt = sendUsdtTransaction(recipientTrc20Address, transferAmountUsdt);
```

---

## 📖 Naming Patterns Demonstrated

### Variables

#### Network Addresses
```javascript
// JavaScript
const trc20ContractAddress = '...';
const erc20TokenAddress = '...';
const bep20WalletAddress = '...';
const bitcoinWalletAddress = '...';

// Python
user_trc20_wallet_address = '...'
erc20_token_contract_address = '...'
recipient_bep20_address = '...'
```

#### Amounts and Values
```javascript
// Always specify currency and units
const transferAmountUsdt = 100;
const networkFeeUsdt = 0.5;
const totalRequiredAmount = transferAmountUsdt + networkFeeUsdt;
const minimumTransactionAmountUsdt = 1;
```

#### Transaction Data
```javascript
const transactionHash = '0x...';
const transactionReceipt = { ... };
const confirmationCount = 12;
const transactionStatus = 'confirmed';
const transactionTimestamp = Date.now();
```

### Functions

#### Action Verbs
```javascript
// Use clear action verbs at the start
function sendTransaction() { }
function getWalletBalance() { }
function calculateNetworkFee() { }
function validateAddress() { }
function verifySignature() { }
function convertTokenAmount() { }
```

#### Network-Specific Functions
```javascript
function transferUsdtOnTrc20() { }
function getErc20TokenBalance() { }
function estimateBep20GasFee() { }
function sendBitcoinTransaction() { }
function validateFantomAddress() { }
```

#### Validation Functions
```javascript
function isValidWalletAddress() { }
function validateTransactionAmount() { }
function verifyTransactionSignature() { }
function checkSufficientBalance() { }
```

### Classes

```javascript
// Use PascalCase and descriptive nouns
class TransactionManager { }
class WalletService { }
class NetworkFeeCalculator { }
class BlockchainProvider { }
class AddressValidator { }
```

### Constants

```javascript
// Use SCREAMING_SNAKE_CASE
const MAXIMUM_TRANSACTION_AMOUNT_USDT = 100000;
const MINIMUM_CONFIRMATION_BLOCKS = 12;
const DEFAULT_TIMEOUT_SECONDS = 300;
const TRANSACTION_VALIDITY_PERIOD_DAYS = 51;
const SUPPORTED_NETWORK_TYPES = ['TRC20', 'ERC20', 'BEP20'];
```

---

## 🔍 Network-Specific Patterns

### TRC20 (Tron)
```javascript
const trc20Address = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
function isValidTrc20Address(address) { }
function transferTrc20Usdt(from, to, amount) { }
function getTrc20TransactionEnergy(tx) { }
```

### ERC20 (Ethereum)
```javascript
const erc20Address = '0xdac17f958d2ee523a2206206994597c13d831ec7';
function isValidErc20Address(address) { }
function transferErc20Token(from, to, amount) { }
function estimateErc20GasCost(tx) { }
```

### BEP20 (Binance Smart Chain)
```javascript
const bep20Address = '0x55d398326f99059fF775485246999027B3197955';
function isValidBep20Address(address) { }
function sendBep20Transaction(from, to, amount) { }
function calculateBep20NetworkFee(gasPrice, gasLimit) { }
```

### BTC (Bitcoin)
```javascript
const bitcoinAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
function isValidBitcoinAddress(address) { }
function createBitcoinTransaction(inputs, outputs) { }
function estimateBitcoinFee(txSize) { }
```

---

## 🎨 Code Style Guidelines

### Documentation
```javascript
/**
 * Sends a USDT transaction on the specified network
 * 
 * @param {string} senderWalletAddress - The address sending USDT
 * @param {string} recipientWalletAddress - The address receiving USDT
 * @param {number} transferAmountUsdt - Amount of USDT to transfer
 * @param {string} networkType - Network type (trc20, erc20, etc.)
 * @returns {Promise<object>} Transaction receipt with hash and status
 * @throws {InsufficientBalanceError} When sender has insufficient balance
 * @throws {InvalidWalletAddressError} When address format is invalid
 */
async function sendUsdtTransaction(
  senderWalletAddress,
  recipientWalletAddress,
  transferAmountUsdt,
  networkType
) {
  // Implementation
}
```

### Error Handling
```javascript
// Descriptive error classes
class InsufficientBalanceError extends Error {
  constructor(availableBalance, requestedAmount) {
    super(`Insufficient balance: ${availableBalance} available, ${requestedAmount} requested`);
    this.availableBalance = availableBalance;
    this.requestedAmount = requestedAmount;
  }
}

// Usage
try {
  await sendTransaction();
} catch (error) {
  if (error instanceof InsufficientBalanceError) {
    console.error(`Not enough funds. Available: ${error.availableBalance}`);
  }
}
```

---

## 🚀 How to Use These Examples

### For New Features
1. **Copy the structure** from the relevant example file
2. **Adapt the naming patterns** to your specific use case
3. **Maintain consistency** with the established conventions
4. **Add comprehensive documentation** following the examples

### For Code Reviews
1. **Compare against examples** to ensure naming consistency
2. **Check that variable names** are as descriptive as in examples
3. **Verify function names** follow the same patterns
4. **Ensure constants** use proper SCREAMING_SNAKE_CASE

### For Refactoring
1. **Identify poorly named** variables and functions
2. **Refer to examples** for better alternatives
3. **Update names systematically** following the patterns
4. **Test thoroughly** after refactoring

---

## 📚 Additional Resources

- [NAMING_CONVENTIONS.md](../NAMING_CONVENTIONS.md) - Complete naming conventions guide
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [README.md](../README.md) - Project overview

---

## ✅ Checklist for Writing Code

Before committing any code, verify:

- [ ] All variables have descriptive, clear names
- [ ] Functions start with action verbs and describe their purpose
- [ ] Constants use SCREAMING_SNAKE_CASE
- [ ] Classes use PascalCase
- [ ] Network-specific code includes network type in names
- [ ] Amount variables specify currency/token type
- [ ] Error classes are descriptive and specific
- [ ] No single-letter variables (except loop counters)
- [ ] No generic names like `data`, `temp`, `value`
- [ ] Documentation explains complex logic
- [ ] Code is consistent with these examples

---

## 💡 Quick Tips

1. **When in doubt, be more descriptive** - longer names are better than ambiguous ones
2. **Think about the reader** - would someone unfamiliar with the code understand it?
3. **Use domain terminology** - "USDT", "TRC20", "transaction", "wallet" are clear
4. **Avoid abbreviations** - `transferAmount` not `txAmt` or `amt`
5. **Be consistent** - if you use `walletAddress` once, use it everywhere

---

**Remember:** Good naming is not about being clever—it's about being clear!
