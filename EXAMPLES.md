# FlashUSDT Gateway - Usage Examples

This document provides practical examples of how to use the FlashUSDT Gateway API.

## Quick Start Example

### Using cURL

#### 1. Check if the gateway is healthy

```bash
curl http://localhost:3000/api/health
```

#### 2. Get list of supported networks

```bash
curl http://localhost:3000/api/networks
```

#### 3. Check balance on TRC20 network

```bash
curl "http://localhost:3000/api/balance?network=trc20&address=TXYZexample1234567890123456789012"
```

#### 4. Transfer USDT on ERC20 network

```bash
curl -X POST http://localhost:3000/api/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "network": "erc20",
    "toAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
    "amount": 100
  }'
```

#### 5. Check transaction status

```bash
curl "http://localhost:3000/api/transaction/status?network=erc20&txHash=0x123abc456def..."
```

## JavaScript/Node.js Example

```javascript
const axios = require('axios');

const GATEWAY_URL = 'http://localhost:3000/api';

// Example 1: Get supported networks
async function getSupportedNetworks() {
  try {
    const response = await axios.get(`${GATEWAY_URL}/networks`);
    console.log('Supported Networks:', response.data);
    return response.data.data.networks;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Example 2: Check balance
async function checkBalance(network, address) {
  try {
    const response = await axios.get(`${GATEWAY_URL}/balance`, {
      params: { network, address }
    });
    console.log(`Balance on ${network}:`, response.data.data.balance);
    return response.data.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Example 3: Transfer USDT
async function transferUSDT(network, toAddress, amount) {
  try {
    const response = await axios.post(`${GATEWAY_URL}/transfer`, {
      network,
      toAddress,
      amount
    });
    console.log('Transfer Result:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Example 4: Check transaction status
async function checkTransactionStatus(network, txHash) {
  try {
    const response = await axios.get(`${GATEWAY_URL}/transaction/status`, {
      params: { network, txHash }
    });
    console.log('Transaction Status:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Usage
(async () => {
  // Get supported networks
  await getSupportedNetworks();

  // Check balance on TRC20
  await checkBalance('trc20', 'TXYZexample1234567890123456789012');

  // Transfer 50 USDT on BEP20
  const transfer = await transferUSDT(
    'bep20',
    '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    50
  );

  // Check transaction status
  if (transfer?.txHash) {
    await checkTransactionStatus('bep20', transfer.txHash);
  }
})();
```

## Python Example

```python
import requests
import json

GATEWAY_URL = 'http://localhost:3000/api'

# Example 1: Get supported networks
def get_supported_networks():
    response = requests.get(f'{GATEWAY_URL}/networks')
    if response.status_code == 200:
        data = response.json()
        print('Supported Networks:', json.dumps(data, indent=2))
        return data['data']['networks']
    else:
        print('Error:', response.text)

# Example 2: Check balance
def check_balance(network, address):
    params = {'network': network, 'address': address}
    response = requests.get(f'{GATEWAY_URL}/balance', params=params)
    if response.status_code == 200:
        data = response.json()
        print(f"Balance on {network}:", data['data']['balance'])
        return data['data']
    else:
        print('Error:', response.text)

# Example 3: Transfer USDT
def transfer_usdt(network, to_address, amount):
    payload = {
        'network': network,
        'toAddress': to_address,
        'amount': amount
    }
    response = requests.post(f'{GATEWAY_URL}/transfer', json=payload)
    if response.status_code == 200:
        data = response.json()
        print('Transfer Result:', json.dumps(data, indent=2))
        return data['data']
    else:
        print('Error:', response.text)

# Example 4: Check transaction status
def check_transaction_status(network, tx_hash):
    params = {'network': network, 'txHash': tx_hash}
    response = requests.get(f'{GATEWAY_URL}/transaction/status', params=params)
    if response.status_code == 200:
        data = response.json()
        print('Transaction Status:', json.dumps(data, indent=2))
        return data['data']
    else:
        print('Error:', response.text)

# Usage
if __name__ == '__main__':
    # Get supported networks
    get_supported_networks()
    
    # Check balance on ERC20
    check_balance('erc20', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')
    
    # Transfer 100 USDT on Fantom
    transfer = transfer_usdt(
        'fantom',
        '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        100
    )
    
    # Check transaction status
    if transfer and 'txHash' in transfer:
        check_transaction_status('fantom', transfer['txHash'])
```

## Error Handling Examples

### Handling Invalid Network

```javascript
try {
  await transferUSDT('invalid_network', '0x...', 100);
} catch (error) {
  if (error.response?.status === 400) {
    console.log('Invalid network specified');
  }
}
```

### Handling Invalid Address

```javascript
try {
  await checkBalance('trc20', 'invalid_address');
} catch (error) {
  if (error.response?.data?.error?.code === 'VALIDATION_ERROR') {
    console.log('Invalid address format');
  }
}
```

### Handling Amount Limits

```javascript
try {
  // Attempting to transfer more than the limit
  await transferUSDT('erc20', '0x...', 20000);
} catch (error) {
  if (error.response?.data?.error?.message?.includes('maximum')) {
    console.log('Amount exceeds maximum limit');
  }
}
```

## Integration Patterns

### Polling for Transaction Confirmation

```javascript
async function waitForConfirmation(network, txHash, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await checkTransactionStatus(network, txHash);
    
    if (status.status === 'confirmed') {
      console.log('Transaction confirmed!');
      return status;
    }
    
    console.log(`Attempt ${i + 1}: Status = ${status.status}`);
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
  }
  
  throw new Error('Transaction confirmation timeout');
}
```

### Batch Balance Check

```javascript
async function checkMultipleBalances(addresses) {
  const networks = ['trc20', 'erc20', 'bep20', 'fantom'];
  const results = [];
  
  for (const address of addresses) {
    for (const network of networks) {
      try {
        const balance = await checkBalance(network, address);
        if (balance.balance > 0) {
          results.push({ network, address, balance: balance.balance });
        }
      } catch (error) {
        // Skip invalid combinations
        continue;
      }
    }
  }
  
  return results;
}
```

## WebSocket Integration (Future Enhancement)

The gateway could be extended to support WebSocket for real-time updates:

```javascript
// Example of how WebSocket support could work (not yet implemented)
const socket = new WebSocket('ws://localhost:3000/ws');

socket.on('transaction_update', (data) => {
  console.log('Transaction update:', data);
});

socket.send(JSON.stringify({
  action: 'subscribe',
  network: 'erc20',
  txHash: '0x123...'
}));
```

## Best Practices

1. **Always validate addresses** before making transfers
2. **Check balances** before attempting transfers
3. **Store transaction hashes** for tracking
4. **Implement retry logic** for network failures
5. **Monitor transaction status** until confirmed
6. **Use appropriate timeouts** for long-running operations
7. **Handle errors gracefully** and provide user feedback

## Rate Limiting

When integrating with the gateway, implement client-side rate limiting:

```javascript
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  async throttle() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.requests.push(now);
  }
}

const limiter = new RateLimiter(10, 60000); // 10 requests per minute

async function rateLimitedTransfer(network, toAddress, amount) {
  await limiter.throttle();
  return transferUSDT(network, toAddress, amount);
}
```

## Support

For more examples or help with integration:
- Check the [Developer Guide](DEVELOPER_GUIDE.md)
- Telegram: [@flashbyMiguel](https://t.me/flashbyMiguel)
- GitHub Issues: [Report an issue](https://github.com/Deejae69/FlashUSDT-Gateway/issues)
