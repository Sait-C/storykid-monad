const express = require('express');
const {
    mintNFT,
    getNFTMetadata,
    getNFTTitle,
    getNFTContent,
    getNFTImage,
    getNFTOwner,
    getBalance,
    getTotalSupply,
    getContractInfo
} = require('../../controllers/nft/nftController');

const router = express.Router();

// NFT minting route (requires authentication)
router.post('/mint', mintNFT);

// NFT metadata routes
router.get('/:tokenId/metadata', getNFTMetadata);
router.get('/:tokenId/title', getNFTTitle);
router.get('/:tokenId/content', getNFTContent);
router.get('/:tokenId/image', getNFTImage);
router.get('/:tokenId/owner', getNFTOwner);

// Balance and supply routes
router.get('/balance/:address', getBalance);
router.get('/total-supply', getTotalSupply);

// Contract info route
router.get('/contract-info', getContractInfo);

module.exports = router;
