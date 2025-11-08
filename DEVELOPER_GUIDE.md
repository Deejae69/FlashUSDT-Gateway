# FlashUSDT Gateway - Developer Guide

## Overview

FlashUSDT Gateway is a Node.js-based API server that provides a unified interface for USDT transfers across multiple blockchain networks including TRC20 (TRON), BEP20 (BSC), ERC20 (Ethereum), Fantom, and Bitcoin.

## Getting Started

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Deejae69/FlashUSDT-Gateway.git
cd FlashUSDT-Gateway
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## Project Structure

```
FlashUSDT-Gateway/
├── src/
│   ├── api/
│   │   └── routes.js          # API route definitions
│   ├── config/
│   │   └── index.js           # Configuration management
│   ├── networks/
│   │   ├── NetworkAdapter.js  # Base adapter interface
│   │   ├── TRC20Adapter.js    # TRON network adapter
│   │   ├── ERC20Adapter.js    # Ethereum network adapter
│   │   ├── BEP20Adapter.js    # BSC network adapter
│   │   ├── FantomAdapter.js   # Fantom network adapter
│   │   ├── BTCAdapter.js      # Bitcoin network adapter
│   │   └── Gateway.js         # Gateway manager
│   ├── utils/
│   │   ├── errors.js          # Error handling utilities
│   │   └── validation.js      # Input validation utilities
│   └── index.js               # Application entry point
├── .env.example               # Example environment configuration
├── .gitignore
├── package.json
├── LICENSE
└── README.md
```

## API Endpoints

### 1. Get Supported Networks

```http
GET /api/networks
```

**Response:**
```json
{
  "success": true,
  "data": {
    "networks": [
      {
        "network": "trc20",
        "name": "TRC20 (TRON)",
        "enabled": true
      },
      {
        "network": "erc20",
        "name": "ERC20 (Ethereum)",
        "enabled": true
      }
      // ... more networks
    ],
    "count": 5
  }
}
```

### 2. Check Balance

```http
GET /api/balance?network={network}&address={address}
```

**Parameters:**
- `network` (string): Network identifier (trc20, erc20, bep20, fantom, btc)
- `address` (string): Wallet address to check

**Response:**
```json
{
  "success": true,
  "data": {
    "network": "trc20",
    "address": "TXYZexample...",
    "balance": 1000.50
  }
}
```

### 3. Transfer USDT

```http
POST /api/transfer
Content-Type: application/json

{
  "network": "trc20",
  "toAddress": "TXYZexample...",
  "amount": 100
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "Transfer completed",
    "txHash": "0x123abc..."
  }
}
```

### 4. Check Transaction Status

```http
GET /api/transaction/status?network={network}&txHash={txHash}
```

**Parameters:**
- `network` (string): Network identifier
- `txHash` (string): Transaction hash

**Response:**
```json
{
  "success": true,
  "data": {
    "network": "trc20",
    "txHash": "0x123abc...",
    "status": "confirmed",
    "confirmations": 12
  }
}
```

### 5. Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-11-08T05:32:00.000Z"
  }
}
```

## Address Format Requirements

Each network has specific address format requirements:

- **TRC20 (TRON)**: Starts with 'T', 34 characters long
  - Example: `TXYZexample1234567890123456789012`

- **ERC20 (Ethereum)**: Starts with '0x', followed by 40 hex characters
  - Example: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0`

- **BEP20 (BSC)**: Same format as Ethereum (EVM-compatible)
  - Example: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0`

- **Fantom**: Same format as Ethereum (EVM-compatible)
  - Example: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0`

- **Bitcoin**: P2PKH, P2SH, or Bech32 format
  - Legacy: `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa`
  - Bech32: `bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq`

## Configuration

The gateway is configured via environment variables. See `.env.example` for all available options.

### Key Configuration Options

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `MAX_TRANSACTION_AMOUNT`: Maximum transfer amount (default: 10000)
- `MIN_TRANSACTION_AMOUNT`: Minimum transfer amount (default: 1)

### Network RPC URLs

Configure RPC endpoints for each network:
- `TRC20_RPC_URL`: TRON network RPC
- `ERC20_RPC_URL`: Ethereum network RPC
- `BEP20_RPC_URL`: BSC network RPC
- `FANTOM_RPC_URL`: Fantom network RPC
- `BTC_RPC_URL`: Bitcoin API endpoint

## Security Considerations

⚠️ **Important Security Notes:**

1. **Never commit private keys** to version control
2. Use `.env` file for sensitive configuration (it's gitignored)
3. Implement rate limiting in production
4. Use HTTPS in production environments
5. Validate and sanitize all user inputs
6. Implement proper authentication and authorization
7. Monitor for suspicious transaction patterns

## Development

### Running in Development Mode

```bash
npm run dev
```

### Adding a New Network

To add support for a new blockchain network:

1. Create a new adapter in `src/networks/` extending `NetworkAdapter`
2. Implement required methods: `initialize()`, `getBalance()`, `transfer()`, `getTransactionStatus()`, `validateAddress()`
3. Add the network configuration in `src/config/index.js`
4. Register the adapter in `src/networks/Gateway.js`

## Error Handling

The API uses standard HTTP status codes and returns errors in a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid address format"
  }
}
```

Common error codes:
- `VALIDATION_ERROR` (400): Invalid input parameters
- `UNAUTHORIZED` (401): Authentication failed
- `NOT_FOUND` (404): Resource not found
- `INTERNAL_ERROR` (500): Server error

## Testing

```bash
npm test
```

Note: Tests are not yet implemented. Contributions welcome!

## Contributing

Contributions are welcome! Please ensure your code follows the existing style and includes appropriate error handling.

## Support

For support and inquiries:
- Telegram: [@flashbyMiguel](https://t.me/flashbyMiguel)
- GitHub Issues: [Create an issue](https://github.com/Deejae69/FlashUSDT-Gateway/issues)

## License

This project is licensed under the Apache License 2.0. See LICENSE file for details.
