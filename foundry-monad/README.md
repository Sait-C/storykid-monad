# StoryKid NFT Contract

This Foundry project contains the smart contracts for the StoryKid NFT platform.

## Overview

The `StoryKidNFT` contract is an ERC721 NFT implementation that allows authorized minters (your backend) to mint NFTs with custom metadata including title, content, and base64-encoded images.

## Features

- **ERC721 Compliance**: Full ERC721 standard implementation
- **Access Control**: Role-based access control for minting
- **Custom Metadata**: Store title, content, and base64 image data
- **Minter Role**: Authorized addresses can mint NFTs
- **Admin Role**: Manage minter roles and contract administration

## Contract Details

### StoryKidNFT.sol

Main NFT contract with the following key functions:

#### Minting
- `mintNFT(address to, string title, string content, string imageBase64)` - Mint a new NFT with custom metadata

#### Metadata Retrieval
- `getTokenMetadata(uint256 tokenId)` - Get all metadata for a token
- `getTokenTitle(uint256 tokenId)` - Get token title
- `getTokenContent(uint256 tokenId)` - Get token content
- `getTokenImage(uint256 tokenId)` - Get base64 image
- `getTokenCreatedAt(uint256 tokenId)` - Get creation timestamp

#### Utility Functions
- `totalSupply()` - Get total number of minted tokens
- `ownerOf(uint256 tokenId)` - Get token owner
- `balanceOf(address owner)` - Get token balance for address

### Roles

- **DEFAULT_ADMIN_ROLE**: Can grant/revoke minter roles
- **MINTER_ROLE**: Can mint new NFTs

## Backend Integration

### Contract Interface

Your backend should interact with the contract using the `IStoryKidNFT` interface:

```solidity
interface IStoryKidNFT {
    function mintNFT(
        address to,
        string memory title,
        string memory content,
        string memory imageBase64
    ) external returns (uint256);
    
    function getTokenMetadata(uint256 tokenId) external view returns (
        string memory title,
        string memory content,
        string memory imageBase64,
        uint256 createdAt
    );
    
    // ... other functions
}
```

### Backend Requirements

1. **Private Key**: Your backend needs a private key with MINTER_ROLE
2. **Web3 Provider**: Connect to your target network (mainnet, testnet, etc.)
3. **Contract Address**: Deploy the contract and store the address

### Example Backend Integration (Node.js/Web3.js)

```javascript
const Web3 = require('web3');
const web3 = new Web3('YOUR_RPC_URL');

// Contract ABI (from compilation artifacts)
const contractABI = [...]; // Your contract ABI
const contractAddress = '0x...'; // Your deployed contract address
const privateKey = 'YOUR_PRIVATE_KEY';

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Mint NFT
async function mintNFT(userAddress, title, content, imageBase64) {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    
    const tx = await contract.methods.mintNFT(
        userAddress,
        title,
        content,
        imageBase64
    ).send({
        from: account.address,
        gas: 500000 // Adjust gas limit as needed
    });
    
    return tx.events.TokenMinted.returnValues.tokenId;
}

// Get token metadata
async function getTokenMetadata(tokenId) {
    return await contract.methods.getTokenMetadata(tokenId).call();
}
```

## Deployment

### Prerequisites

1. Install Foundry: https://book.getfoundry.sh/getting-started/installation
2. Set up your environment variables:
   ```bash
   export PRIVATE_KEY="your_private_key"
   export RPC_URL="your_rpc_url"
   ```

### Deploy to Network

```bash
# Deploy to a specific network
forge script script/DeployStoryKidNFT.s.sol --rpc-url $RPC_URL --broadcast --verify

# Deploy to local testnet
forge script script/DeployStoryKidNFT.s.sol --fork-url $RPC_URL --broadcast
```

### Grant Minter Role to Backend

After deployment, grant the MINTER_ROLE to your backend address:

```bash
# Using cast (Foundry CLI)
cast send $CONTRACT_ADDRESS "grantRole(bytes32,address)" $(cast keccak256 "MINTER_ROLE") $BACKEND_ADDRESS --private-key $ADMIN_PRIVATE_KEY --rpc-url $RPC_URL
```

## Testing

Run the test suite:

```bash
# Run all tests
forge test

# Run with verbose output
forge test -vvv

# Run specific test
forge test --match-test testMintNFT
```

## Gas Optimization

The contract is optimized for gas efficiency:
- Uses OpenZeppelin's efficient ERC721 implementation
- Minimal storage operations
- Efficient role-based access control

## Security Considerations

1. **Private Key Security**: Store your backend's private key securely
2. **Role Management**: Regularly audit who has minter roles
3. **Input Validation**: Validate all inputs in your backend before calling the contract
4. **Gas Limits**: Set appropriate gas limits for minting operations

## Network Support

The contract is compatible with:
- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism
- Any EVM-compatible network

## License

MIT License - see LICENSE file for details.