"""
Example: Wallet Service with Descriptive Naming (Python)

This file demonstrates proper naming conventions for the FlashUSDT-Gateway project in Python.
All variable names, function names, and class names follow the guidelines in NAMING_CONVENTIONS.md
"""

from typing import Dict, List, Optional
from enum import Enum
from datetime import datetime, timedelta
from decimal import Decimal

# ============================================================================
# CONSTANTS - Use SCREAMING_SNAKE_CASE with descriptive names
# ============================================================================

MINIMUM_WALLET_BALANCE_USDT = Decimal('0.01')
DEFAULT_NETWORK_TIMEOUT_SECONDS = 30
MAXIMUM_RETRY_ATTEMPTS = 3
RETRY_DELAY_SECONDS = 5

TRANSACTION_VALIDITY_PERIOD_DAYS = 51
SUPPORTED_TOKEN_SYMBOLS = ['USDT', 'USDC', 'DAI', 'BTC']


# ============================================================================
# ENUMS - Use PascalCase for enum class, SCREAMING_SNAKE_CASE for values
# ============================================================================

class NetworkType(Enum):
    """Supported blockchain network types"""
    TRC20 = 'trc20'
    ERC20 = 'erc20'
    BEP20 = 'bep20'
    BTC = 'btc'
    FANTOM = 'fantom'


class TransactionStatus(Enum):
    """Transaction status states"""
    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    FAILED = 'failed'
    CANCELLED = 'cancelled'


class WalletType(Enum):
    """Supported wallet types"""
    METAMASK = 'metamask'
    TRUST_WALLET = 'trust_wallet'
    LEDGER = 'ledger'
    TREZOR = 'trezor'
    ATOMIC = 'atomic'
    EXODUS = 'exodus'
    BINANCE = 'binance'


# ============================================================================
# CUSTOM EXCEPTION CLASSES - Use descriptive PascalCase names
# ============================================================================

class WalletConnectionError(Exception):
    """Raised when unable to connect to wallet"""
    
    def __init__(self, wallet_address: str, wallet_type: WalletType, error_message: str):
        self.wallet_address = wallet_address
        self.wallet_type = wallet_type
        super().__init__(
            f"Failed to connect to {wallet_type.value} wallet {wallet_address}: {error_message}"
        )


class InsufficientBalanceError(Exception):
    """Raised when wallet has insufficient balance"""
    
    def __init__(self, available_balance: Decimal, required_amount: Decimal, token_symbol: str):
        self.available_balance = available_balance
        self.required_amount = required_amount
        self.token_symbol = token_symbol
        super().__init__(
            f"Insufficient {token_symbol} balance: {available_balance} available, "
            f"{required_amount} required"
        )


class InvalidAddressFormatError(Exception):
    """Raised when wallet address format is invalid"""
    
    def __init__(self, wallet_address: str, expected_network: NetworkType):
        self.wallet_address = wallet_address
        self.expected_network = expected_network
        super().__init__(
            f"Invalid address format for {expected_network.value}: {wallet_address}"
        )


# ============================================================================
# WALLET SERVICE CLASS
# ============================================================================

class WalletService:
    """
    Service for managing cryptocurrency wallet operations
    
    Handles wallet connections, balance checking, and transaction signing
    for multiple blockchain networks.
    """
    
    def __init__(self, blockchain_provider):
        """
        Initialize wallet service
        
        Args:
            blockchain_provider: Provider for blockchain network interactions
        """
        self.blockchain_provider = blockchain_provider
        self.connected_wallets: Dict[str, Dict] = {}
        self.wallet_balance_cache: Dict[str, Dict] = {}
    
    def connect_wallet(
        self, 
        wallet_address: str, 
        wallet_type: WalletType,
        network_type: NetworkType
    ) -> Dict:
        """
        Connect to a cryptocurrency wallet
        
        Args:
            wallet_address: The wallet's public address
            wallet_type: Type of wallet (MetaMask, Trust Wallet, etc.)
            network_type: Blockchain network to connect to
            
        Returns:
            Dictionary containing wallet connection details
            
        Raises:
            InvalidAddressFormatError: If address format is invalid
            WalletConnectionError: If connection fails
        """
        # Validate wallet address format
        if not self._is_valid_wallet_address(wallet_address, network_type):
            raise InvalidAddressFormatError(wallet_address, network_type)
        
        try:
            # Establish connection to wallet
            connection_timestamp = datetime.now()
            wallet_connection_details = {
                'address': wallet_address,
                'wallet_type': wallet_type,
                'network': network_type,
                'connected_at': connection_timestamp,
                'is_active': True
            }
            
            # Store connection information
            wallet_cache_key = self._generate_wallet_cache_key(wallet_address, network_type)
            self.connected_wallets[wallet_cache_key] = wallet_connection_details
            
            return wallet_connection_details
            
        except Exception as error:
            raise WalletConnectionError(
                wallet_address, 
                wallet_type, 
                str(error)
            )
    
    def disconnect_wallet(self, wallet_address: str, network_type: NetworkType) -> bool:
        """
        Disconnect from a cryptocurrency wallet
        
        Args:
            wallet_address: The wallet's public address
            network_type: Blockchain network the wallet is connected to
            
        Returns:
            True if successfully disconnected, False otherwise
        """
        wallet_cache_key = self._generate_wallet_cache_key(wallet_address, network_type)
        
        if wallet_cache_key in self.connected_wallets:
            self.connected_wallets[wallet_cache_key]['is_active'] = False
            return True
        
        return False
    
    def get_wallet_balance(
        self, 
        wallet_address: str, 
        network_type: NetworkType,
        token_symbol: str = 'USDT',
        force_refresh: bool = False
    ) -> Decimal:
        """
        Get current balance of a wallet
        
        Args:
            wallet_address: The wallet's public address
            network_type: Blockchain network to query
            token_symbol: Token to check balance for (default: USDT)
            force_refresh: If True, bypass cache and fetch fresh balance
            
        Returns:
            Current wallet balance as Decimal
            
        Raises:
            InvalidAddressFormatError: If address format is invalid
        """
        # Validate address
        if not self._is_valid_wallet_address(wallet_address, network_type):
            raise InvalidAddressFormatError(wallet_address, network_type)
        
        # Check cache first unless force refresh requested
        wallet_cache_key = self._generate_wallet_cache_key(wallet_address, network_type)
        
        if not force_refresh and wallet_cache_key in self.wallet_balance_cache:
            cached_balance_data = self.wallet_balance_cache[wallet_cache_key]
            cache_age_seconds = (datetime.now() - cached_balance_data['cached_at']).total_seconds()
            
            # Use cache if less than 60 seconds old
            if cache_age_seconds < 60:
                return cached_balance_data['balance']
        
        # Fetch fresh balance from blockchain
        current_balance = self.blockchain_provider.query_balance(
            wallet_address, 
            network_type,
            token_symbol
        )
        
        # Update cache
        self.wallet_balance_cache[wallet_cache_key] = {
            'balance': current_balance,
            'token_symbol': token_symbol,
            'cached_at': datetime.now()
        }
        
        return current_balance
    
    def verify_sufficient_balance(
        self,
        wallet_address: str,
        network_type: NetworkType,
        required_amount: Decimal,
        token_symbol: str = 'USDT'
    ) -> bool:
        """
        Verify wallet has sufficient balance for a transaction
        
        Args:
            wallet_address: The wallet's public address
            network_type: Blockchain network to query
            required_amount: Minimum amount required
            token_symbol: Token to check
            
        Returns:
            True if balance is sufficient, False otherwise
            
        Raises:
            InsufficientBalanceError: If balance is insufficient
        """
        current_wallet_balance = self.get_wallet_balance(
            wallet_address, 
            network_type,
            token_symbol,
            force_refresh=True
        )
        
        if current_wallet_balance < required_amount:
            raise InsufficientBalanceError(
                current_wallet_balance,
                required_amount,
                token_symbol
            )
        
        return True
    
    def get_transaction_history(
        self,
        wallet_address: str,
        network_type: NetworkType,
        limit_results: int = 50,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Dict]:
        """
        Get transaction history for a wallet
        
        Args:
            wallet_address: The wallet's public address
            network_type: Blockchain network to query
            limit_results: Maximum number of transactions to return
            start_date: Optional start date for filtering
            end_date: Optional end date for filtering
            
        Returns:
            List of transaction dictionaries
        """
        # Set default date range if not provided
        if end_date is None:
            end_date = datetime.now()
        
        if start_date is None:
            start_date = end_date - timedelta(days=30)
        
        # Fetch transactions from blockchain
        transaction_history_list = self.blockchain_provider.query_transactions(
            wallet_address,
            network_type,
            start_date,
            end_date,
            limit_results
        )
        
        # Parse and format transactions with descriptive field names
        formatted_transactions = []
        for raw_transaction_data in transaction_history_list:
            formatted_transaction = {
                'transaction_hash': raw_transaction_data['hash'],
                'sender_address': raw_transaction_data['from'],
                'recipient_address': raw_transaction_data['to'],
                'transfer_amount': Decimal(str(raw_transaction_data['value'])),
                'network_fee': Decimal(str(raw_transaction_data['fee'])),
                'transaction_timestamp': datetime.fromtimestamp(raw_transaction_data['timestamp']),
                'confirmation_count': raw_transaction_data['confirmations'],
                'status': TransactionStatus(raw_transaction_data['status']),
                'block_number': raw_transaction_data['block_number']
            }
            formatted_transactions.append(formatted_transaction)
        
        return formatted_transactions
    
    def export_wallet_data(
        self,
        wallet_address: str,
        network_type: NetworkType,
        include_transaction_history: bool = True
    ) -> Dict:
        """
        Export comprehensive wallet data
        
        Args:
            wallet_address: The wallet's public address
            network_type: Blockchain network
            include_transaction_history: Whether to include transaction history
            
        Returns:
            Dictionary containing wallet information
        """
        wallet_data_export = {
            'wallet_address': wallet_address,
            'network_type': network_type.value,
            'exported_at': datetime.now().isoformat(),
            'balances': {}
        }
        
        # Get balances for all supported tokens
        for token_symbol in SUPPORTED_TOKEN_SYMBOLS:
            try:
                token_balance = self.get_wallet_balance(
                    wallet_address,
                    network_type,
                    token_symbol
                )
                wallet_data_export['balances'][token_symbol] = str(token_balance)
            except Exception:
                wallet_data_export['balances'][token_symbol] = 'unavailable'
        
        # Include transaction history if requested
        if include_transaction_history:
            transaction_history = self.get_transaction_history(
                wallet_address,
                network_type
            )
            wallet_data_export['transaction_count'] = len(transaction_history)
            wallet_data_export['recent_transactions'] = [
                {
                    'hash': tx['transaction_hash'],
                    'amount': str(tx['transfer_amount']),
                    'timestamp': tx['transaction_timestamp'].isoformat(),
                    'status': tx['status'].value
                }
                for tx in transaction_history[:10]  # Last 10 transactions
            ]
        
        return wallet_data_export
    
    def _is_valid_wallet_address(
        self, 
        wallet_address: str, 
        network_type: NetworkType
    ) -> bool:
        """
        Validate wallet address format for specific network
        
        Args:
            wallet_address: Address to validate
            network_type: Network type for validation
            
        Returns:
            True if valid, False otherwise
        """
        if not wallet_address or not isinstance(wallet_address, str):
            return False
        
        # Network-specific validation
        if network_type == NetworkType.TRC20:
            return self._is_valid_trc20_address(wallet_address)
        elif network_type in [NetworkType.ERC20, NetworkType.BEP20, NetworkType.FANTOM]:
            return self._is_valid_ethereum_address(wallet_address)
        elif network_type == NetworkType.BTC:
            return self._is_valid_bitcoin_address(wallet_address)
        
        return False
    
    def _is_valid_trc20_address(self, trc20_address: str) -> bool:
        """Validate TRC20 (Tron) address format"""
        TRC20_ADDRESS_LENGTH = 34
        TRC20_ADDRESS_PREFIX = 'T'
        
        return (len(trc20_address) == TRC20_ADDRESS_LENGTH and 
                trc20_address.startswith(TRC20_ADDRESS_PREFIX))
    
    def _is_valid_ethereum_address(self, ethereum_address: str) -> bool:
        """Validate Ethereum-compatible address format"""
        import re
        ETHEREUM_ADDRESS_PATTERN = r'^0x[a-fA-F0-9]{40}$'
        return bool(re.match(ETHEREUM_ADDRESS_PATTERN, ethereum_address))
    
    def _is_valid_bitcoin_address(self, bitcoin_address: str) -> bool:
        """Validate Bitcoin address format"""
        import re
        BITCOIN_LEGACY_PATTERN = r'^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$'
        BITCOIN_SEGWIT_PATTERN = r'^bc1[a-z0-9]{39,59}$'
        
        return (bool(re.match(BITCOIN_LEGACY_PATTERN, bitcoin_address)) or
                bool(re.match(BITCOIN_SEGWIT_PATTERN, bitcoin_address)))
    
    def _generate_wallet_cache_key(
        self, 
        wallet_address: str, 
        network_type: NetworkType
    ) -> str:
        """Generate unique cache key for wallet"""
        return f"{network_type.value}:{wallet_address.lower()}"


# ============================================================================
# USAGE EXAMPLE
# ============================================================================

def demonstrate_wallet_service_usage():
    """Demonstrate usage of WalletService with descriptive naming"""
    
    # Initialize service
    blockchain_provider = BlockchainProvider()
    wallet_service = WalletService(blockchain_provider)
    
    # Define wallet parameters with clear names
    user_trc20_wallet_address = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
    selected_wallet_type = WalletType.TRUST_WALLET
    selected_network = NetworkType.TRC20
    required_transfer_amount = Decimal('100.00')
    
    try:
        # Connect to wallet
        wallet_connection = wallet_service.connect_wallet(
            user_trc20_wallet_address,
            selected_wallet_type,
            selected_network
        )
        print(f"Connected to {selected_wallet_type.value} wallet")
        print(f"Address: {wallet_connection['address']}")
        
        # Check balance
        current_usdt_balance = wallet_service.get_wallet_balance(
            user_trc20_wallet_address,
            selected_network,
            token_symbol='USDT'
        )
        print(f"Current USDT balance: {current_usdt_balance}")
        
        # Verify sufficient balance
        has_sufficient_balance = wallet_service.verify_sufficient_balance(
            user_trc20_wallet_address,
            selected_network,
            required_transfer_amount,
            token_symbol='USDT'
        )
        
        if has_sufficient_balance:
            print(f"✓ Sufficient balance for transfer of {required_transfer_amount} USDT")
        
        # Get transaction history
        transaction_history = wallet_service.get_transaction_history(
            user_trc20_wallet_address,
            selected_network,
            limit_results=10
        )
        print(f"Found {len(transaction_history)} recent transactions")
        
        # Export wallet data
        wallet_export = wallet_service.export_wallet_data(
            user_trc20_wallet_address,
            selected_network
        )
        print(f"Wallet data exported at {wallet_export['exported_at']}")
        
    except InvalidAddressFormatError as error:
        print(f"Error: Invalid address format - {error}")
    except InsufficientBalanceError as error:
        print(f"Error: Insufficient balance - Available: {error.available_balance}, "
              f"Required: {error.required_amount}")
    except WalletConnectionError as error:
        print(f"Error: Failed to connect to wallet - {error}")
    except Exception as error:
        print(f"Unexpected error: {error}")


if __name__ == '__main__':
    demonstrate_wallet_service_usage()
