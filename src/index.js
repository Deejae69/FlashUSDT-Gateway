/**
 * FlashUSDT Gateway - Main Entry Point
 * A seamless, secure, and high-speed solution for USDT transfers
 */

const express = require('express');
const config = require('./config');
const Gateway = require('./networks/Gateway');
const createApiRouter = require('./api/routes');
const { errorHandler } = require('./utils/errors');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize Gateway
const gateway = new Gateway(config);

// API Routes
app.use('/api', createApiRouter(gateway));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'FlashUSDT Gateway',
    version: '1.0.0',
    description: 'A seamless, secure, and high-speed solution for USDT transfers across TRC20, BEP20, ERC20, BTC, and Fantom networks',
    endpoints: {
      health: '/api/health',
      networks: '/api/networks',
      balance: '/api/balance?network={network}&address={address}',
      transfer: '/api/transfer',
      transactionStatus: '/api/transaction/status?network={network}&txHash={txHash}'
    },
    documentation: 'https://github.com/Deejae69/FlashUSDT-Gateway'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
async function start() {
  try {
    // Initialize gateway and all network adapters
    await gateway.initialize();

    // Start listening
    app.listen(config.port, () => {
      console.log('');
      console.log('═══════════════════════════════════════════════════════');
      console.log('  FlashUSDT Gateway - Fast & Secure Crypto Transfers');
      console.log('═══════════════════════════════════════════════════════');
      console.log(`  Server running on port ${config.port}`);
      console.log(`  Environment: ${config.nodeEnv}`);
      console.log(`  API Base URL: http://localhost:${config.port}/api`);
      console.log('');
      console.log('  Supported Networks:');
      const networks = gateway.getSupportedNetworks();
      networks.forEach(n => {
        console.log(`    • ${n.name}`);
      });
      console.log('');
      console.log('═══════════════════════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the application
start();

module.exports = app;
