// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/StoryKidNFT.sol";

contract StoryKidNFTTest is Test {
    StoryKidNFT public nft;
    address public admin;
    address public minter;
    address public user;
    address public unauthorized;

    event TokenMinted(
        uint256 indexed tokenId,
        address indexed to,
        string title,
        uint256 createdAt
    );

    function setUp() public {
        admin = address(0x1);
        minter = address(0x2);
        user = address(0x3);
        unauthorized = address(0x4);

        vm.startPrank(admin);
        nft = new StoryKidNFT("StoryKid NFT", "SKN", admin);
        nft.grantRole(nft.MINTER_ROLE(), minter);
        vm.stopPrank();
    }

    function testInitialState() public view {
        assertEq(nft.name(), "StoryKid NFT");
        assertEq(nft.symbol(), "SKN");
        assertEq(nft.totalSupply(), 0);
        assertTrue(nft.hasRole(nft.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(nft.hasRole(nft.MINTER_ROLE(), admin));
        assertTrue(nft.hasRole(nft.MINTER_ROLE(), minter));
    }

    function testMintNFT() public {
        string memory title = "My First Story";
        string memory content = "This is a beautiful story about adventure";
        string memory imageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

        vm.expectEmit(true, true, false, true);
        emit TokenMinted(0, user, title, block.timestamp);

        vm.prank(minter);
        uint256 tokenId = nft.mintNFT(user, title, content, imageBase64);

        assertEq(tokenId, 0);
        assertEq(nft.ownerOf(tokenId), user);
        assertEq(nft.totalSupply(), 1);
        assertEq(nft.balanceOf(user), 1);
    }

    function testMintNFTByAdmin() public {
        string memory title = "Admin Story";
        string memory content = "Story created by admin";
        string memory imageBase64 = "data:image/png;base64,test";

        vm.prank(admin);
        uint256 tokenId = nft.mintNFT(user, title, content, imageBase64);

        assertEq(tokenId, 0);
        assertEq(nft.ownerOf(tokenId), user);
    }

    function testMintNFTUnauthorized() public {
        string memory title = "Unauthorized Story";
        string memory content = "This should fail";
        string memory imageBase64 = "data:image/png;base64,test";

        vm.prank(unauthorized);
        vm.expectRevert();
        nft.mintNFT(user, title, content, imageBase64);
    }

    function testGetTokenMetadata() public {
        string memory title = "Test Story";
        string memory content = "Test content";
        string memory imageBase64 = "data:image/png;base64,testdata";

        vm.prank(minter);
        uint256 tokenId = nft.mintNFT(user, title, content, imageBase64);

        (
            string memory retrievedTitle,
            string memory retrievedContent,
            string memory retrievedImage,
            uint256 createdAt
        ) = nft.getTokenMetadata(tokenId);

        assertEq(retrievedTitle, title);
        assertEq(retrievedContent, content);
        assertEq(retrievedImage, imageBase64);
        assertEq(createdAt, block.timestamp);
    }

    function testGetTokenTitle() public {
        string memory title = "Title Test";
        string memory content = "Content";
        string memory imageBase64 = "data:image/png;base64,test";

        vm.prank(minter);
        uint256 tokenId = nft.mintNFT(user, title, content, imageBase64);

        assertEq(nft.getTokenTitle(tokenId), title);
    }

    function testGetTokenContent() public {
        string memory title = "Title";
        string memory content = "Content Test";
        string memory imageBase64 = "data:image/png;base64,test";

        vm.prank(minter);
        uint256 tokenId = nft.mintNFT(user, title, content, imageBase64);

        assertEq(nft.getTokenContent(tokenId), content);
    }

    function testGetTokenImage() public {
        string memory title = "Title";
        string memory content = "Content";
        string memory imageBase64 = "data:image/png;base64,imagetest";

        vm.prank(minter);
        uint256 tokenId = nft.mintNFT(user, title, content, imageBase64);

        assertEq(nft.getTokenImage(tokenId), imageBase64);
    }

    function testGetTokenCreatedAt() public {
        string memory title = "Title";
        string memory content = "Content";
        string memory imageBase64 = "data:image/png;base64,test";

        vm.prank(minter);
        uint256 tokenId = nft.mintNFT(user, title, content, imageBase64);

        assertEq(nft.getTokenCreatedAt(tokenId), block.timestamp);
    }

    function testMultipleMints() public {
        string memory title1 = "Story 1";
        string memory content1 = "Content 1";
        string memory imageBase64_1 = "data:image/png;base64,image1";

        string memory title2 = "Story 2";
        string memory content2 = "Content 2";
        string memory imageBase64_2 = "data:image/png;base64,image2";

        vm.prank(minter);
        uint256 tokenId1 = nft.mintNFT(user, title1, content1, imageBase64_1);

        vm.prank(minter);
        uint256 tokenId2 = nft.mintNFT(user, title2, content2, imageBase64_2);

        assertEq(tokenId1, 0);
        assertEq(tokenId2, 1);
        assertEq(nft.totalSupply(), 2);
        assertEq(nft.balanceOf(user), 2);

        assertEq(nft.getTokenTitle(tokenId1), title1);
        assertEq(nft.getTokenTitle(tokenId2), title2);
    }

    function testGetMetadataForNonExistentToken() public {
        vm.expectRevert("Token does not exist");
        nft.getTokenMetadata(999);
    }

    function testGetTitleForNonExistentToken() public {
        vm.expectRevert("Token does not exist");
        nft.getTokenTitle(999);
    }

    function testGetContentForNonExistentToken() public {
        vm.expectRevert("Token does not exist");
        nft.getTokenContent(999);
    }

    function testGetImageForNonExistentToken() public {
        vm.expectRevert("Token does not exist");
        nft.getTokenImage(999);
    }

    function testGetCreatedAtForNonExistentToken() public {
        vm.expectRevert("Token does not exist");
        nft.getTokenCreatedAt(999);
    }

    function testSupportsInterface() public view {
        // ERC721 interface
        assertTrue(nft.supportsInterface(0x80ac58cd));
        // AccessControl interface
        assertTrue(nft.supportsInterface(0x7965db0b));
        // ERC165 interface
        assertTrue(nft.supportsInterface(0x01ffc9a7));
    }

    function testRoleManagement() public {
        address newMinter = address(0x5);
        
        // Verify admin has admin role
        assertTrue(nft.hasRole(nft.DEFAULT_ADMIN_ROLE(), admin));
        
        // Admin can grant minter role
        vm.startPrank(admin);
        nft.grantRole(nft.MINTER_ROLE(), newMinter);
        vm.stopPrank();
        assertTrue(nft.hasRole(nft.MINTER_ROLE(), newMinter));

        // New minter can mint
        vm.prank(newMinter);
        uint256 tokenId = nft.mintNFT(user, "New Minter Story", "Content", "data:image/png;base64,test");
        assertEq(tokenId, nft.totalSupply() - 1);

        // Admin can revoke minter role
        vm.startPrank(admin);
        nft.revokeRole(nft.MINTER_ROLE(), newMinter);
        vm.stopPrank();
        assertFalse(nft.hasRole(nft.MINTER_ROLE(), newMinter));

        // Revoked minter cannot mint
        vm.prank(newMinter);
        vm.expectRevert();
        nft.mintNFT(user, "Should Fail", "Content", "data:image/png;base64,test");
    }
}
