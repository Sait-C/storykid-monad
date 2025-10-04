// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StoryKidNFTInterface
 * @dev Interface for StoryKid NFT contract
 * @notice This interface defines the functions your backend can use to interact with the NFT contract
 */
interface IStoryKidNFT {
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
    ) external returns (uint256);

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
        );

    /**
     * @dev Get the title of a specific token
     * @param tokenId The ID of the token
     * @return The title of the NFT
     */
    function getTokenTitle(uint256 tokenId) external view returns (string memory);

    /**
     * @dev Get the content of a specific token
     * @param tokenId The ID of the token
     * @return The content of the NFT
     */
    function getTokenContent(uint256 tokenId) external view returns (string memory);

    /**
     * @dev Get the base64 image of a specific token
     * @param tokenId The ID of the token
     * @return The base64 encoded image
     */
    function getTokenImage(uint256 tokenId) external view returns (string memory);

    /**
     * @dev Get the creation timestamp of a specific token
     * @param tokenId The ID of the token
     * @return The timestamp when the NFT was created
     */
    function getTokenCreatedAt(uint256 tokenId) external view returns (uint256);

    /**
     * @dev Get the total number of tokens minted
     * @return The total supply of tokens
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Get the owner of a specific token
     * @param tokenId The ID of the token
     * @return The address of the token owner
     */
    function ownerOf(uint256 tokenId) external view returns (address);

    /**
     * @dev Get the balance of tokens for an address
     * @param owner The address to check
     * @return The number of tokens owned by the address
     */
    function balanceOf(address owner) external view returns (uint256);
}
