/**
 * Example: Transaction Manager with Descriptive Naming
 * 
 * This file demonstrates proper naming conventions for the FlashUSDT-Gateway project.
 * All variable names, function names, and class names follow the guidelines in NAMING_CONVENTIONS.md
 */

// ============================================================================
// CONSTANTS - Use SCREAMING_SNAKE_CASE with descriptive names
// ============================================================================

const MAXIMUM_TRANSACTION_AMOUNT_USDT = 100000;
const MINIMUM_TRANSACTION_AMOUNT_USDT = 1;
const DEFAULT_TRANSACTION_TIMEOUT_SECONDS = 300;
const REQUIRED_CONFIRMATION_BLOCKS = 12;
// Transaction validity period of 51 days balances security with flexibility
// as specified in the FlashUSDT-Gateway requirements
const TRANSACTION_VALIDITY_PERIOD_DAYS = 51;

const SUPPORTED_NETWORK_TYPES = {
  TRC20: 'trc20',
  ERC20: 'erc20',
  BEP20: 'bep20',
  BTC: 'btc',
  FANTOM: 'fantom'
};

const NETWORK_NAMES = {
  [SUPPORTED_NETWORK_TYPES.TRC20]: 'Tron (TRC20)',
  [SUPPORTED_NETWORK_TYPES.ERC20]: 'Ethereum (ERC20)',
  [SUPPORTED_NETWORK_TYPES.BEP20]: 'Binance Smart Chain (BEP20)',
  [SUPPORTED_NETWORK_TYPES.BTC]: 'Bitcoin',
  [SUPPORTED_NETWORK_TYPES.FANTOM]: 'Fantom'
};

// ============================================================================
// CUSTOM ERROR CLASSES - Use descriptive PascalCase names
// ============================================================================

class InsufficientBalanceError extends Error {
  constructor(availableBalance, requestedAmount) {
    super(`Insufficient balance: ${availableBalance} USDT available, ${requestedAmount} USDT requested`);
    this.name = 'InsufficientBalanceError';
    this.availableBalance = availableBalance;
    this.requestedAmount = requestedAmount;
  }
}

class InvalidWalletAddressError extends Error {
  constructor(walletAddress, networkType) {
    super(`Invalid ${networkType} wallet address: ${walletAddress}`);
    this.name = 'InvalidWalletAddressError';
    this.walletAddress = walletAddress;
    this.networkType = networkType;
  }
}

class TransactionTimeoutError extends Error {
  constructor(transactionHash, timeoutSeconds) {
    super(`Transaction ${transactionHash} timed out after ${timeoutSeconds} seconds`);
    this.name = 'TransactionTimeoutError';
    this.transactionHash = transactionHash;
    this.timeoutSeconds = timeoutSeconds;
  }
}

class NetworkConnectionError extends Error {
  constructor(networkType, errorMessage) {
    super(`Failed to connect to ${networkType} network: ${errorMessage}`);
    this.name = 'NetworkConnectionError';
    this.networkType = networkType;
  }
}

// ============================================================================
// TRANSACTION MANAGER CLASS
// ============================================================================

class TransactionManager {
  constructor(networkProvider, walletService) {
    this.networkProvider = networkProvider;
    this.walletService = walletService;
    this.pendingTransactions = new Map();
  }

  /**
   * Sends a USDT transaction on the specified network
   * 
   * @param {string} senderWalletAddress - The address sending USDT
   * @param {string} recipientWalletAddress - The address receiving USDT
   * @param {number} transferAmountUsdt - Amount of USDT to transfer
   * @param {string} networkType - Network type (trc20, erc20, bep20, etc.)
   * @returns {Promise<object>} Transaction receipt with hash and status
   */
  async sendUsdtTransaction(
    senderWalletAddress, 
    recipientWalletAddress, 
    transferAmountUsdt, 
    networkType
  ) {
    // Validate inputs with descriptive error messages
    this.validateTransactionParameters(
      senderWalletAddress,
      recipientWalletAddress,
      transferAmountUsdt,
      networkType
    );

    // Calculate fee with descriptive variable name
    const estimatedNetworkFeeUsdt = await this.calculateNetworkFee(
      transferAmountUsdt,
      networkType
    );

    // Check balance with descriptive variable names
    const currentWalletBalance = await this.walletService.getBalance(
      senderWalletAddress,
      networkType
    );

    const totalRequiredAmount = transferAmountUsdt + estimatedNetworkFeeUsdt;

    if (currentWalletBalance < totalRequiredAmount) {
      throw new InsufficientBalanceError(currentWalletBalance, totalRequiredAmount);
    }

    // Prepare transaction with descriptive object properties
    const transactionParameters = {
      fromAddress: senderWalletAddress,
      toAddress: recipientWalletAddress,
      amountUsdt: transferAmountUsdt,
      networkFeeUsdt: estimatedNetworkFeeUsdt,
      networkType: networkType,
      timestamp: Date.now(),
      expirationDate: this.calculateExpirationDate()
    };

    // Send transaction and get receipt
    const transactionReceipt = await this.networkProvider.sendTransaction(
      transactionParameters
    );

    // Track pending transaction
    this.pendingTransactions.set(transactionReceipt.hash, {
      status: 'pending',
      confirmations: 0,
      submittedAt: Date.now()
    });

    return transactionReceipt;
  }

  /**
   * Validates transaction parameters before processing
   * 
   * @param {string} senderAddress - Sender wallet address
   * @param {string} recipientAddress - Recipient wallet address  
   * @param {number} amount - Transfer amount in USDT
   * @param {string} network - Network type
   * @throws {InvalidWalletAddressError} If addresses are invalid
   * @throws {Error} If amount is out of bounds
   */
  validateTransactionParameters(senderAddress, recipientAddress, amount, network) {
    // Validate sender address with network-specific validation
    if (!this.isValidWalletAddress(senderAddress, network)) {
      throw new InvalidWalletAddressError(senderAddress, network);
    }

    // Validate recipient address
    if (!this.isValidWalletAddress(recipientAddress, network)) {
      throw new InvalidWalletAddressError(recipientAddress, network);
    }

    // Validate amount is within acceptable range
    if (amount < MINIMUM_TRANSACTION_AMOUNT_USDT) {
      throw new Error(
        `Transaction amount ${amount} is below minimum of ${MINIMUM_TRANSACTION_AMOUNT_USDT} USDT`
      );
    }

    if (amount > MAXIMUM_TRANSACTION_AMOUNT_USDT) {
      throw new Error(
        `Transaction amount ${amount} exceeds maximum of ${MAXIMUM_TRANSACTION_AMOUNT_USDT} USDT`
      );
    }

    // Validate network type is supported
    const supportedNetworks = Object.values(SUPPORTED_NETWORK_TYPES);
    if (!supportedNetworks.includes(network)) {
      throw new Error(
        `Network type ${network} is not supported. Supported networks: ${supportedNetworks.join(', ')}`
      );
    }
  }

  /**
   * Validates wallet address format for specific network
   * 
   * @param {string} walletAddress - Address to validate
   * @param {string} networkType - Network type (trc20, erc20, etc.)
   * @returns {boolean} True if address is valid for the network
   */
  isValidWalletAddress(walletAddress, networkType) {
    if (!walletAddress || typeof walletAddress !== 'string') {
      return false;
    }

    switch (networkType) {
      case SUPPORTED_NETWORK_TYPES.TRC20:
        return this.isValidTrc20Address(walletAddress);
      
      case SUPPORTED_NETWORK_TYPES.ERC20:
      case SUPPORTED_NETWORK_TYPES.BEP20:
        return this.isValidEthereumAddress(walletAddress);
      
      case SUPPORTED_NETWORK_TYPES.BTC:
        return this.isValidBitcoinAddress(walletAddress);
      
      case SUPPORTED_NETWORK_TYPES.FANTOM:
        return this.isValidFantomAddress(walletAddress);
      
      default:
        return false;
    }
  }

  /**
   * Validates TRC20 (Tron) wallet address format
   * 
   * @param {string} trc20Address - Tron address to validate
   * @returns {boolean} True if valid TRC20 address
   */
  isValidTrc20Address(trc20Address) {
    const TRC20_ADDRESS_LENGTH = 34;
    const TRC20_ADDRESS_PREFIX = 'T';
    
    return trc20Address.length === TRC20_ADDRESS_LENGTH &&
           trc20Address.startsWith(TRC20_ADDRESS_PREFIX);
  }

  /**
   * Validates Ethereum-compatible address (ERC20/BEP20)
   * 
   * @param {string} ethereumAddress - Ethereum address to validate
   * @returns {boolean} True if valid Ethereum address
   */
  isValidEthereumAddress(ethereumAddress) {
    const ETHEREUM_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;
    return ETHEREUM_ADDRESS_PATTERN.test(ethereumAddress);
  }

  /**
   * Validates Bitcoin wallet address format
   * 
   * @param {string} bitcoinAddress - Bitcoin address to validate
   * @returns {boolean} True if valid Bitcoin address
   */
  isValidBitcoinAddress(bitcoinAddress) {
    // Bitcoin addresses can start with 1, 3, or bc1
    const BITCOIN_LEGACY_PATTERN = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    const BITCOIN_SEGWIT_PATTERN = /^bc1[a-z0-9]{39,59}$/;
    
    return BITCOIN_LEGACY_PATTERN.test(bitcoinAddress) ||
           BITCOIN_SEGWIT_PATTERN.test(bitcoinAddress);
  }

  /**
   * Validates Fantom wallet address format
   * 
   * @param {string} fantomAddress - Fantom address to validate
   * @returns {boolean} True if valid Fantom address
   */
  isValidFantomAddress(fantomAddress) {
    // Fantom uses Ethereum-compatible addresses
    return this.isValidEthereumAddress(fantomAddress);
  }

  /**
   * Calculates network fee for a transaction
   * 
   * @param {number} transferAmount - Amount being transferred
   * @param {string} networkType - Network type
   * @returns {Promise<number>} Estimated fee in USDT
   */
  async calculateNetworkFee(transferAmount, networkType) {
    const currentGasPrice = await this.networkProvider.getCurrentGasPrice(networkType);
    const estimatedGasUnits = await this.networkProvider.estimateGasUnits(
      transferAmount,
      networkType
    );
    
    const networkFeeInNativeToken = currentGasPrice * estimatedGasUnits;
    const networkFeeInUsdt = await this.convertNativeTokenToUsdt(
      networkFeeInNativeToken,
      networkType
    );
    
    return networkFeeInUsdt;
  }

  /**
   * Converts native token amount to USDT value
   * 
   * @param {number} nativeTokenAmount - Amount in native token
   * @param {string} networkType - Network type
   * @returns {Promise<number>} Equivalent amount in USDT
   */
  async convertNativeTokenToUsdt(nativeTokenAmount, networkType) {
    const exchangeRate = await this.networkProvider.getTokenExchangeRate(networkType);
    return nativeTokenAmount * exchangeRate;
  }

  /**
   * Calculates transaction expiration date based on validity period
   * 
   * @returns {Date} Expiration date
   */
  calculateExpirationDate() {
    const currentDate = new Date();
    const expirationDate = new Date(currentDate);
    expirationDate.setDate(currentDate.getDate() + TRANSACTION_VALIDITY_PERIOD_DAYS);
    return expirationDate;
  }

  /**
   * Checks the confirmation status of a transaction
   * 
   * @param {string} transactionHash - Hash of the transaction to check
   * @returns {Promise<object>} Transaction status with confirmation count
   */
  async checkTransactionConfirmation(transactionHash) {
    const transactionDetails = await this.networkProvider.getTransactionDetails(
      transactionHash
    );

    const currentConfirmationCount = transactionDetails.confirmations;
    const isFullyConfirmed = currentConfirmationCount >= REQUIRED_CONFIRMATION_BLOCKS;

    return {
      transactionHash: transactionHash,
      confirmationCount: currentConfirmationCount,
      requiredConfirmations: REQUIRED_CONFIRMATION_BLOCKS,
      isConfirmed: isFullyConfirmed,
      status: transactionDetails.status
    };
  }

  /**
   * Waits for transaction to be confirmed on the blockchain
   * 
   * @param {string} transactionHash - Hash of transaction to monitor
   * @param {number} timeoutSeconds - Maximum time to wait
   * @returns {Promise<object>} Final transaction status
   */
  async waitForTransactionConfirmation(transactionHash, timeoutSeconds = DEFAULT_TRANSACTION_TIMEOUT_SECONDS) {
    const startTime = Date.now();
    const timeoutMilliseconds = timeoutSeconds * 1000;

    while (true) {
      const elapsedTime = Date.now() - startTime;
      
      if (elapsedTime >= timeoutMilliseconds) {
        throw new TransactionTimeoutError(transactionHash, timeoutSeconds);
      }

      const confirmationStatus = await this.checkTransactionConfirmation(transactionHash);
      
      if (confirmationStatus.isConfirmed) {
        this.pendingTransactions.delete(transactionHash);
        return confirmationStatus;
      }

      // Wait before checking again
      const pollingIntervalMilliseconds = 10000; // 10 seconds
      await this.sleep(pollingIntervalMilliseconds);
    }
  }

  /**
   * Utility function to pause execution
   * 
   * @param {number} milliseconds - Time to sleep in milliseconds
   * @returns {Promise<void>}
   */
  sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Gets list of all pending transactions
   * 
   * @returns {Array<object>} Array of pending transaction objects
   */
  getPendingTransactions() {
    const pendingTransactionsList = [];
    
    for (const [transactionHash, transactionStatus] of this.pendingTransactions.entries()) {
      pendingTransactionsList.push({
        hash: transactionHash,
        status: transactionStatus.status,
        confirmations: transactionStatus.confirmations,
        submittedAt: transactionStatus.submittedAt
      });
    }
    
    return pendingTransactionsList;
  }
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

async function demonstrateTransactionManagerUsage() {
  // Initialize services with descriptive variable names
  const networkProvider = new NetworkProvider();
  const walletService = new WalletService();
  const transactionManager = new TransactionManager(networkProvider, walletService);

  // Define transaction parameters with clear names
  const senderTrc20Address = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
  const recipientTrc20Address = 'TXYZhHq5eFGcPm9vF7H3L2AtSzgjLk7u9v';
  const transferAmountUsdt = 100;
  const selectedNetwork = SUPPORTED_NETWORK_TYPES.TRC20;

  try {
    // Send transaction
    const transactionReceipt = await transactionManager.sendUsdtTransaction(
      senderTrc20Address,
      recipientTrc20Address,
      transferAmountUsdt,
      selectedNetwork
    );

    console.log(`Transaction submitted successfully`);
    console.log(`Transaction hash: ${transactionReceipt.hash}`);
    console.log(`Network: ${NETWORK_NAMES[selectedNetwork]}`);

    // Wait for confirmation
    const confirmedTransaction = await transactionManager.waitForTransactionConfirmation(
      transactionReceipt.hash
    );

    console.log(`Transaction confirmed with ${confirmedTransaction.confirmationCount} confirmations`);

  } catch (error) {
    if (error instanceof InsufficientBalanceError) {
      console.error(`Error: Not enough balance. Available: ${error.availableBalance} USDT`);
    } else if (error instanceof InvalidWalletAddressError) {
      console.error(`Error: Invalid wallet address for ${error.networkType}`);
    } else if (error instanceof TransactionTimeoutError) {
      console.error(`Error: Transaction timed out after ${error.timeoutSeconds} seconds`);
    } else {
      console.error(`Unexpected error: ${error.message}`);
    }
  }
}

// Export for use in other modules
module.exports = {
  TransactionManager,
  InsufficientBalanceError,
  InvalidWalletAddressError,
  TransactionTimeoutError,
  NetworkConnectionError,
  SUPPORTED_NETWORK_TYPES,
  NETWORK_NAMES
};
