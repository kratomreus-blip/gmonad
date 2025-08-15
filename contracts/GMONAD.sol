// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GMONAD is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _nextTokenId = 1;
    uint256 public constant MINT_PRICE = 1 ether; // 1 MONAD
    string private _baseTokenURI;
    
    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, uint256 price);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    constructor(address initialOwner, string memory baseURI) 
        ERC721("GMONAD", "GMONAD") 
        Ownable(initialOwner) 
    {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Public mint function - anyone can mint by paying 1 MONAD
     * Funds are automatically sent to the contract owner
     */
    function mint() external payable nonReentrant {
        require(msg.value >= MINT_PRICE, "Insufficient payment: 1 MONAD required");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        
        // Immediately transfer funds to owner
        (bool success, ) = owner().call{value: msg.value}("");
        require(success, "Transfer to owner failed");
        
        emit NFTMinted(msg.sender, tokenId, msg.value);
    }

    /**
     * @dev Mint specific token ID (for testing or special cases)
     */
    function mintWithTokenId(uint256 tokenId) external payable nonReentrant {
        require(msg.value >= MINT_PRICE, "Insufficient payment: 1 MONAD required");
        require(!_exists(tokenId), "Token already exists");
        
        _safeMint(msg.sender, tokenId);
        
        // Update next token ID if necessary
        if (tokenId >= _nextTokenId) {
            _nextTokenId = tokenId + 1;
        }
        
        // Immediately transfer funds to owner
        (bool success, ) = owner().call{value: msg.value}("");
        require(success, "Transfer to owner failed");
        
        emit NFTMinted(msg.sender, tokenId, msg.value);
    }

    /**
     * @dev Owner can mint for free (for promotional purposes)
     */
    function ownerMint(address to, uint256 tokenId) external onlyOwner {
        require(!_exists(tokenId), "Token already exists");
        _safeMint(to, tokenId);
        
        if (tokenId >= _nextTokenId) {
            _nextTokenId = tokenId + 1;
        }
    }

    /**
     * @dev Get the next token ID that will be minted
     */
    function getNextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Set base URI for metadata (only owner)
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Get base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Check if token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @dev Emergency withdraw function (should not be needed since funds auto-transfer)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner(), balance);
    }

    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // The following functions are overrides required by Solidity.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(_exists(tokenId), "Token does not exist");
        
        string memory baseURI = _baseURI();
        if (bytes(baseURI).length == 0) {
            // Default metadata for GMONAD
            return string(abi.encodePacked(
                'data:application/json;base64,',
                'eyJuYW1lIjoiR01PTkFEICMnLCB0b2tlbklkLCAnIiwgImRlc2NyaXB0aW9uIjoiZ21vbmFkIG9uIGZhcmNhc3RlciIsICJpbWFnZSI6ICJodHRwczovL2kuc2VlZG4uaW8vZzMweDMwLnBuZyJ9'
            ));
        }
        
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

