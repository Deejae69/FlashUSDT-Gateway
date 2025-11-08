/**
 * API Routes for FlashUSDT Gateway
 */

const express = require('express');
const { ValidationError } = require('../utils/errors');
const {
  validateTransferRequest,
  validateBalanceRequest,
  validateTransactionStatusRequest
} = require('../utils/validation');

function createApiRouter(gateway) {
  const router = express.Router();

  /**
   * GET /api/networks
   * Get list of supported networks
   */
  router.get('/networks', (req, res) => {
    const networks = gateway.getSupportedNetworks();
    res.json({
      success: true,
      data: {
        networks,
        count: networks.length
      }
    });
  });

  /**
   * GET /api/balance
   * Get balance for an address on a specific network
   * Query params: network, address
   */
  router.get('/balance', async (req, res, next) => {
    try {
      const validation = validateBalanceRequest(req);
      if (!validation.isValid) {
        throw new ValidationError(validation.errors.join(', '));
      }

      const { network, address } = req.query;
      
      // Validate address format
      if (!gateway.validateAddress(network, address)) {
        throw new ValidationError('Invalid address format for the specified network');
      }

      const balance = await gateway.getBalance(network, address);
      
      res.json({
        success: true,
        data: {
          network,
          address,
          balance
        }
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * POST /api/transfer
   * Transfer USDT to an address on a specific network
   * Body: { network, toAddress, amount }
   */
  router.post('/transfer', async (req, res, next) => {
    try {
      const validation = validateTransferRequest(req);
      if (!validation.isValid) {
        throw new ValidationError(validation.errors.join(', '));
      }

      const { network, toAddress, amount } = req.body;

      // Validate address format
      if (!gateway.validateAddress(network, toAddress)) {
        throw new ValidationError('Invalid recipient address format for the specified network');
      }

      const result = await gateway.transfer(network, toAddress, amount);
      
      res.json({
        success: result.success,
        data: result
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/transaction/status
   * Get transaction status
   * Query params: network, txHash
   */
  router.get('/transaction/status', async (req, res, next) => {
    try {
      const validation = validateTransactionStatusRequest(req);
      if (!validation.isValid) {
        throw new ValidationError(validation.errors.join(', '));
      }

      const { network, txHash } = req.query;
      const status = await gateway.getTransactionStatus(network, txHash);
      
      res.json({
        success: true,
        data: {
          network,
          txHash,
          ...status
        }
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/health
   * Health check endpoint
   */
  router.get('/health', (req, res) => {
    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString()
      }
    });
  });

  return router;
}

module.exports = createApiRouter;
