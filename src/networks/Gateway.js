/**
 * Gateway Manager
 * Manages all network adapters and provides unified interface
 */

const TRC20Adapter = require('./TRC20Adapter');
const ERC20Adapter = require('./ERC20Adapter');
const BEP20Adapter = require('./BEP20Adapter');
const FantomAdapter = require('./FantomAdapter');
const BTCAdapter = require('./BTCAdapter');

class Gateway {
  constructor(config) {
    this.config = config;
    this.adapters = {};
    this.initializeAdapters();
  }

  initializeAdapters() {
    // Initialize all network adapters
    this.adapters.trc20 = new TRC20Adapter(this.config.networks.trc20);
    this.adapters.erc20 = new ERC20Adapter(this.config.networks.erc20);
    this.adapters.bep20 = new BEP20Adapter(this.config.networks.bep20);
    this.adapters.fantom = new FantomAdapter(this.config.networks.fantom);
    this.adapters.btc = new BTCAdapter(this.config.networks.btc);
  }

  async initialize() {
    console.log('Initializing FlashUSDT Gateway...');
    const initPromises = Object.entries(this.adapters).map(async ([network, adapter]) => {
      try {
        if (this.config.networks[network]?.enabled) {
          await adapter.initialize();
          console.log(`✓ ${network.toUpperCase()} initialized`);
        }
      } catch (error) {
        console.error(`✗ Failed to initialize ${network}:`, error.message);
      }
    });
    await Promise.all(initPromises);
    console.log('Gateway initialization complete');
  }

  getAdapter(network) {
    const adapter = this.adapters[network.toLowerCase()];
    if (!adapter) {
      throw new Error(`Unsupported network: ${network}`);
    }
    return adapter;
  }

  async getBalance(network, address) {
    const adapter = this.getAdapter(network);
    return await adapter.getBalance(address);
  }

  async transfer(network, toAddress, amount) {
    const adapter = this.getAdapter(network);
    
    // Validate amount limits
    if (amount < this.config.limits.minAmount) {
      throw new Error(`Amount below minimum: ${this.config.limits.minAmount}`);
    }
    if (amount > this.config.limits.maxAmount) {
      throw new Error(`Amount above maximum: ${this.config.limits.maxAmount}`);
    }

    return await adapter.transfer(toAddress, amount);
  }

  async getTransactionStatus(network, txHash) {
    const adapter = this.getAdapter(network);
    return await adapter.getTransactionStatus(txHash);
  }

  getSupportedNetworks() {
    return Object.entries(this.config.networks)
      .filter(([_, config]) => config.enabled)
      .map(([network, config]) => ({
        network,
        name: config.name,
        enabled: config.enabled
      }));
  }

  validateAddress(network, address) {
    const adapter = this.getAdapter(network);
    return adapter.validateAddress(address);
  }
}

module.exports = Gateway;
