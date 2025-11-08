/**
 * Configuration management for FlashUSDT Gateway
 */

const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Network RPC endpoints
  networks: {
    trc20: {
      rpcUrl: process.env.TRC20_RPC_URL || 'https://api.trongrid.io',
      enabled: true,
      name: 'TRC20 (TRON)'
    },
    erc20: {
      rpcUrl: process.env.ERC20_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
      enabled: true,
      name: 'ERC20 (Ethereum)'
    },
    bep20: {
      rpcUrl: process.env.BEP20_RPC_URL || 'https://bsc-dataseed.binance.org',
      enabled: true,
      name: 'BEP20 (BSC)'
    },
    fantom: {
      rpcUrl: process.env.FANTOM_RPC_URL || 'https://rpc.ftm.tools',
      enabled: true,
      name: 'Fantom'
    },
    btc: {
      rpcUrl: process.env.BTC_RPC_URL || 'https://blockstream.info/api',
      enabled: true,
      name: 'Bitcoin'
    }
  },

  // Wallet configuration
  wallet: {
    privateKey: process.env.WALLET_PRIVATE_KEY || ''
  },

  // API keys
  apiKeys: {
    infura: process.env.INFURA_API_KEY || '',
    etherscan: process.env.ETHERSCAN_API_KEY || '',
    bscscan: process.env.BSCSCAN_API_KEY || ''
  },

  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET || 'default_secret_change_me',
    apiKey: process.env.API_KEY || ''
  },

  // Transaction limits
  limits: {
    maxAmount: parseFloat(process.env.MAX_TRANSACTION_AMOUNT) || 10000,
    minAmount: parseFloat(process.env.MIN_TRANSACTION_AMOUNT) || 1
  },

  // Gas settings
  gas: {
    priceMultiplier: parseFloat(process.env.GAS_PRICE_MULTIPLIER) || 1.2,
    maxGasPrice: parseFloat(process.env.MAX_GAS_PRICE) || 100
  }
};

module.exports = config;
