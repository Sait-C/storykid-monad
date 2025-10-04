const { ethers } = require('ethers');
const path = require('path');
const fs = require('fs');

class StoryKidNFTService {
    constructor() {
        this.contractAddress = '0x0566197A3fd2dDcC469c666661C00C4bBc588FAD';
        this.rpcUrl = process.env.MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz';
        this.privateKey = process.env.PRIVATE_KEY;
        
        // Initialize provider and wallet
        this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
        this.wallet = new ethers.Wallet(this.privateKey, this.provider);
        
        // Load ABI from external file
        const abiPath = path.join(__dirname, '../../abi/StoryKidNFT.json');
        this.contractABI = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
        
        // Initialize contract instance
        this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.wallet);
    }

    /**
     * Mint a new NFT
     * @param {string} to - Address to mint the NFT to
     * @param {string} title - Title of the NFT
     * @param {string} content - Content/description of the NFT
     * @param {string} imageBase64 - Base64 encoded image data
     * @returns {Promise<Object>} Transaction result with tokenId
     */
    async mintNFT(to, title, content, imageBase64) {
        try {
            console.log(`Minting NFT to ${to} with title: ${title}`);
            
            const tx = await this.contract.mintNFT(to, title, content, imageBase64);
            const receipt = await tx.wait();
            
            // Extract tokenId from the transaction receipt
            const tokenId = receipt.logs[0].args.tokenId.toString();
            
            return {
                success: true,
                tokenId: tokenId,
                transactionHash: tx.hash,
                blockNumber: receipt.blockNumber
            };
        } catch (error) {
            console.error('Error minting NFT:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get complete metadata for a token
     * @param {string|number} tokenId - Token ID
     * @returns {Promise<Object>} Token metadata
     */
    async getTokenMetadata(tokenId) {
        try {
            const metadata = await this.contract.getTokenMetadata(tokenId);
            return {
                success: true,
                title: metadata[0],
                content: metadata[1],
                imageBase64: metadata[2],
                createdAt: metadata[3].toString()
            };
        } catch (error) {
            console.error('Error getting token metadata:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get token title
     * @param {string|number} tokenId - Token ID
     * @returns {Promise<Object>} Token title
     */
    async getTokenTitle(tokenId) {
        try {
            const title = await this.contract.getTokenTitle(tokenId);
            return {
                success: true,
                title: title
            };
        } catch (error) {
            console.error('Error getting token title:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get token content
     * @param {string|number} tokenId - Token ID
     * @returns {Promise<Object>} Token content
     */
    async getTokenContent(tokenId) {
        try {
            const content = await this.contract.getTokenContent(tokenId);
            return {
                success: true,
                content: content
            };
        } catch (error) {
            console.error('Error getting token content:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get token image
     * @param {string|number} tokenId - Token ID
     * @returns {Promise<Object>} Token image
     */
    async getTokenImage(tokenId) {
        try {
            const image = await this.contract.getTokenImage(tokenId);
            return {
                success: true,
                imageBase64: image
            };
        } catch (error) {
            console.error('Error getting token image:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get token creation timestamp
     * @param {string|number} tokenId - Token ID
     * @returns {Promise<Object>} Token creation timestamp
     */
    async getTokenCreatedAt(tokenId) {
        try {
            const createdAt = await this.contract.getTokenCreatedAt(tokenId);
            return {
                success: true,
                createdAt: createdAt.toString()
            };
        } catch (error) {
            console.error('Error getting token creation time:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get total supply of tokens
     * @returns {Promise<Object>} Total supply
     */
    async getTotalSupply() {
        try {
            const totalSupply = await this.contract.totalSupply();
            return {
                success: true,
                totalSupply: totalSupply.toString()
            };
        } catch (error) {
            console.error('Error getting total supply:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get owner of a token
     * @param {string|number} tokenId - Token ID
     * @returns {Promise<Object>} Token owner
     */
    async getTokenOwner(tokenId) {
        try {
            const owner = await this.contract.ownerOf(tokenId);
            return {
                success: true,
                owner: owner
            };
        } catch (error) {
            console.error('Error getting token owner:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get balance of tokens for an address
     * @param {string} address - Address to check
     * @returns {Promise<Object>} Token balance
     */
    async getBalance(address) {
        try {
            const balance = await this.contract.balanceOf(address);
            return {
                success: true,
                balance: balance.toString()
            };
        } catch (error) {
            console.error('Error getting balance:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get contract name
     * @returns {Promise<Object>} Contract name
     */
    async getContractName() {
        try {
            const name = await this.contract.name();
            return {
                success: true,
                name: name
            };
        } catch (error) {
            console.error('Error getting contract name:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get contract symbol
     * @returns {Promise<Object>} Contract symbol
     */
    async getContractSymbol() {
        try {
            const symbol = await this.contract.symbol();
            return {
                success: true,
                symbol: symbol
            };
        } catch (error) {
            console.error('Error getting contract symbol:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = StoryKidNFTService;
