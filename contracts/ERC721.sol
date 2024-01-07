// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CosmoNFT is ERC721  {
    uint256 public maxSupply = 10000;
    uint256 public mintPrice = 0.1 ether;
    uint256 public currentSupply = 0;

    constructor() ERC721("CosmoNFT", "Cosmo") {}

    function mint() external payable {
        require(currentSupply < maxSupply, "Max supply atteint");
        require(msg.value >= mintPrice, "Insuffisent");
        uint256 tokenId = currentSupply + 1;
        _safeMint(msg.sender, tokenId);
        currentSupply += 1;
    }
}
