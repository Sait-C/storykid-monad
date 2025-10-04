const StoryKidNFTService = require('../../services/contract/StoryKidNFTService');
const asyncHandler = require('../../middleware/async');

// Initialize NFT service
const nftService = new StoryKidNFTService();

/**
 * @desc    Mint a new NFT
 * @route   POST /api/nft/mint
 * @access  Private
 */
const mintNFT = asyncHandler(async (req, res) => {
    const { to, title, content, imageBase64 } = req.body;

    // Validate required fields
    if (!to || !title || !content || !imageBase64) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: to, title, content, imageBase64'
        });
    }

    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(to)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Ethereum address format'
        });
    }

    try {
        const result = await nftService.mintNFT(to, title, content, imageBase64);
        
        if (result.success) {
            res.status(201).json({
                success: true,
                message: 'NFT minted successfully',
                data: {
                    tokenId: result.tokenId,
                    transactionHash: result.transactionHash,
                    blockNumber: result.blockNumber
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to mint NFT',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while minting NFT',
            error: error.message
        });
    }
});

/**
 * @desc    Get NFT metadata
 * @route   GET /api/nft/:tokenId/metadata
 * @access  Public
 */
const getNFTMetadata = asyncHandler(async (req, res) => {
    const { tokenId } = req.params;

    if (!tokenId || isNaN(tokenId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid token ID'
        });
    }

    try {
        const result = await nftService.getTokenMetadata(tokenId);
        
        if (result.success) {
            res.status(200).json({
                success: true,
                data: {
                    tokenId: tokenId,
                    title: result.title,
                    content: result.content,
                    imageBase64: result.imageBase64,
                    createdAt: result.createdAt
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'NFT not found or error retrieving metadata',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving NFT metadata',
            error: error.message
        });
    }
});

/**
 * @desc    Get NFT title
 * @route   GET /api/nft/:tokenId/title
 * @access  Public
 */
const getNFTTitle = asyncHandler(async (req, res) => {
    const { tokenId } = req.params;

    if (!tokenId || isNaN(tokenId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid token ID'
        });
    }

    try {
        const result = await nftService.getTokenTitle(tokenId);
        
        if (result.success) {
            res.status(200).json({
                success: true,
                data: {
                    tokenId: tokenId,
                    title: result.title
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'NFT not found or error retrieving title',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving NFT title',
            error: error.message
        });
    }
});

/**
 * @desc    Get NFT content
 * @route   GET /api/nft/:tokenId/content
 * @access  Public
 */
const getNFTContent = asyncHandler(async (req, res) => {
    const { tokenId } = req.params;

    if (!tokenId || isNaN(tokenId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid token ID'
        });
    }

    try {
        const result = await nftService.getTokenContent(tokenId);
        
        if (result.success) {
            res.status(200).json({
                success: true,
                data: {
                    tokenId: tokenId,
                    content: result.content
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'NFT not found or error retrieving content',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving NFT content',
            error: error.message
        });
    }
});

/**
 * @desc    Get NFT image
 * @route   GET /api/nft/:tokenId/image
 * @access  Public
 */
const getNFTImage = asyncHandler(async (req, res) => {
    const { tokenId } = req.params;

    if (!tokenId || isNaN(tokenId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid token ID'
        });
    }

    try {
        const result = await nftService.getTokenImage(tokenId);
        
        if (result.success) {
            res.status(200).json({
                success: true,
                data: {
                    tokenId: tokenId,
                    imageBase64: result.imageBase64
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'NFT not found or error retrieving image',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving NFT image',
            error: error.message
        });
    }
});

/**
 * @desc    Get NFT owner
 * @route   GET /api/nft/:tokenId/owner
 * @access  Public
 */
const getNFTOwner = asyncHandler(async (req, res) => {
    const { tokenId } = req.params;

    if (!tokenId || isNaN(tokenId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid token ID'
        });
    }

    try {
        const result = await nftService.getTokenOwner(tokenId);
        
        if (result.success) {
            res.status(200).json({
                success: true,
                data: {
                    tokenId: tokenId,
                    owner: result.owner
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'NFT not found or error retrieving owner',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving NFT owner',
            error: error.message
        });
    }
});

/**
 * @desc    Get user's NFT balance
 * @route   GET /api/nft/balance/:address
 * @access  Public
 */
const getBalance = asyncHandler(async (req, res) => {
    const { address } = req.params;

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Ethereum address format'
        });
    }

    try {
        const result = await nftService.getBalance(address);
        
        if (result.success) {
            res.status(200).json({
                success: true,
                data: {
                    address: address,
                    balance: result.balance
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Error retrieving balance',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving balance',
            error: error.message
        });
    }
});

/**
 * @desc    Get total supply
 * @route   GET /api/nft/total-supply
 * @access  Public
 */
const getTotalSupply = asyncHandler(async (req, res) => {
    try {
        const result = await nftService.getTotalSupply();
        
        if (result.success) {
            res.status(200).json({
                success: true,
                data: {
                    totalSupply: result.totalSupply
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Error retrieving total supply',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving total supply',
            error: error.message
        });
    }
});

/**
 * @desc    Get contract info
 * @route   GET /api/nft/contract-info
 * @access  Public
 */
const getContractInfo = asyncHandler(async (req, res) => {
    try {
        const [nameResult, symbolResult, totalSupplyResult] = await Promise.all([
            nftService.getContractName(),
            nftService.getContractSymbol(),
            nftService.getTotalSupply()
        ]);

        res.status(200).json({
            success: true,
            data: {
                name: nameResult.success ? nameResult.name : 'Unknown',
                symbol: symbolResult.success ? symbolResult.symbol : 'Unknown',
                totalSupply: totalSupplyResult.success ? totalSupplyResult.totalSupply : '0',
                contractAddress: nftService.contractAddress
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving contract info',
            error: error.message
        });
    }
});

module.exports = {
    mintNFT,
    getNFTMetadata,
    getNFTTitle,
    getNFTContent,
    getNFTImage,
    getNFTOwner,
    getBalance,
    getTotalSupply,
    getContractInfo
};
