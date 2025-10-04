// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/StoryKidNFT.sol";

contract DeployStoryKidNFT is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("MONAD_PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with the account:", deployer);
        console.log("Account balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        StoryKidNFT nft = new StoryKidNFT(
            "StoryKid NFT",
            "SKN",
            deployer
        );

        vm.stopBroadcast();

        console.log("StoryKidNFT deployed to:", address(nft));
        console.log("Admin role granted to:", deployer);
        console.log("Minter role granted to:", deployer);
    }
}
