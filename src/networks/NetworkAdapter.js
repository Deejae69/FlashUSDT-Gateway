/**
 * Base Network Adapter Interface
 * All network adapters should implement this interface
 */

class NetworkAdapter {
  constructor(config) {
    this.config = config;
    this.networkName = 'Base Network';
  }

  /**
   * Initialize the network connection
   */
  async initialize() {
    throw new Error('initialize() must be implemented by subclass');
  }

  /**
   * Get balance for an address
   * @param {string} address - Wallet address
   * @returns {Promise<number>} Balance in USDT
   */
  async getBalance(address) {
    throw new Error('getBalance() must be implemented by subclass');
  }

  /**
   * Transfer USDT to an address
   * @param {string} toAddress - Recipient address
   * @param {number} amount - Amount in USDT
   * @returns {Promise<Object>} Transaction result
   */
  async transfer(toAddress, amount) {
    throw new Error('transfer() must be implemented by subclass');
  }

  /**
   * Get transaction status
   * @param {string} txHash - Transaction hash
   * @returns {Promise<Object>} Transaction status
   */
  async getTransactionStatus(txHash) {
    throw new Error('getTransactionStatus() must be implemented by subclass');
  }

  /**
   * Validate an address
   * @param {string} address - Address to validate
   * @returns {boolean} True if valid
   */
  validateAddress(address) {
    throw new Error('validateAddress() must be implemented by subclass');
  }

  /**
   * Get network information
   * @returns {Object} Network details
   */
  getNetworkInfo() {
    return {
      name: this.networkName,
      enabled: true,
      rpcUrl: this.config.rpcUrl
    };
  }
}

module.exports = NetworkAdapter;
