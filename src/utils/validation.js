/**
 * Utility functions for validation
 */

const validateTransferRequest = (req) => {
  const { network, toAddress, amount } = req.body;
  const errors = [];

  if (!network) {
    errors.push('Network is required');
  }

  if (!toAddress) {
    errors.push('Recipient address is required');
  }

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    errors.push('Valid amount is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateBalanceRequest = (req) => {
  const { network, address } = req.query;
  const errors = [];

  if (!network) {
    errors.push('Network is required');
  }

  if (!address) {
    errors.push('Address is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateTransactionStatusRequest = (req) => {
  const { network, txHash } = req.query;
  const errors = [];

  if (!network) {
    errors.push('Network is required');
  }

  if (!txHash) {
    errors.push('Transaction hash is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateTransferRequest,
  validateBalanceRequest,
  validateTransactionStatusRequest
};
