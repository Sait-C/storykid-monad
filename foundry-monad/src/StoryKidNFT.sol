// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title StoryKidNFT
 * @dev ERC721 NFT contract for StoryKid platform
 * @notice This contract allows authorized minters to mint NFTs with custom metadata
 */
contract StoryKidNFT is ERC721, AccessControl {
    using Strings for uint256;

    // Role for authorized minters (your backend)
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Counter for token IDs
    uint256 private _tokenIdCounter;

    // Struct to store custom metadata
    struct TokenMetadata {
        string title;
        string content;
        string imageBase64;
        uint256 createdAt;
    }

    // Mapping from token ID to metadata
    mapping(uint256 => TokenMetadata) private _tokenMetadata;

    // Events
    event TokenMinted(
        uint256 indexed tokenId,
        address indexed to,
        string title,
        uint256 createdAt
    );

    /**
     * @dev Constructor
     * @param name The name of the NFT collection
     * @param symbol The symbol of the NFT collection
     * @param admin The address that will be granted admin role
     */
    constructor(
        string memory name,
        string memory symbol,
        address admin
    ) ERC721(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin); // Admin is also a minter by default
    }

    /**
     * @dev Mint a new NFT with custom metadata
     * @param to The address to mint the NFT to
     * @param title The title of the NFT content
     * @param content The content/description of the NFT
     * @param imageBase64 The base64 encoded image data
     * @return tokenId The ID of the newly minted token
     */
    function mintNFT(
        address to,
        string memory title,
        string memory content,
        string memory imageBase64
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);

        // Store custom metadata
        _tokenMetadata[tokenId] = TokenMetadata({
            title: title,
            content: content,
            imageBase64: imageBase64,
            createdAt: block.timestamp
        });

        emit TokenMinted(tokenId, to, title, block.timestamp);

        return tokenId;
    }

    /**
     * @dev Get the metadata for a specific token
     * @param tokenId The ID of the token
     * @return title The title of the NFT
     * @return content The content of the NFT
     * @return imageBase64 The base64 encoded image
     * @return createdAt The timestamp when the NFT was created
     */
    function getTokenMetadata(
        uint256 tokenId
    )
        external
        view
        returns (
            string memory title,
            string memory content,
            string memory imageBase64,
            uint256 createdAt
        )
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        TokenMetadata memory metadata = _tokenMetadata[tokenId];
        return (
            metadata.title,
            metadata.content,
            metadata.imageBase64,
            metadata.createdAt
        );
    }

    /**
     * @dev Get the title of a specific token
     * @param tokenId The ID of the token
     * @return The title of the NFT
     */
    function getTokenTitle(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenMetadata[tokenId].title;
    }

    /**
     * @dev Get the content of a specific token
     * @param tokenId The ID of the token
     * @return The content of the NFT
     */
    function getTokenContent(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenMetadata[tokenId].content;
    }

    /**
     * @dev Get the base64 image of a specific token
     * @param tokenId The ID of the token
     * @return The base64 encoded image
     */
    function getTokenImage(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenMetadata[tokenId].imageBase64;
    }

    /**
     * @dev Get the creation timestamp of a specific token
     * @param tokenId The ID of the token
     * @return The timestamp when the NFT was created
     */
    function getTokenCreatedAt(uint256 tokenId) external view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenMetadata[tokenId].createdAt;
    }

    /**
     * @dev Get the total number of tokens minted
     * @return The total supply of tokens
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Override supportsInterface to include AccessControl
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Override _update to emit Transfer events properly
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        return super._update(to, tokenId, auth);
    }
}
