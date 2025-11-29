// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DocumentNFT is ERC721Upgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    using Strings for uint256;
    uint256 private _tokenIdCounter;

    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    struct Document {
        string cid;
        string metadata;
        uint256 timestamp;
    }

    mapping(string => uint256) private _cidToTokenId;
    mapping(uint256 => Document) private _documents;

    event DocumentMinted(uint256 indexed tokenId, address indexed owner, string cid, string metadata, uint256 timestamp);
    event DocumentBurned(uint256 indexed tokenId, address indexed owner);
    event DocumentUpgraded(string version);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(string memory name, string memory symbol, address admin) public initializer {
        __ERC721_init(name, symbol);
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    function mintDocument(address to, string calldata cid, string calldata metadata) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(bytes(cid).length > 0, "CID cannot be empty");
        require(_cidToTokenId[cid] == 0, "Document with this CID already exists");

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(to, newTokenId);
        _cidToTokenId[cid] = newTokenId;
        _documents[newTokenId] = Document(cid, metadata, block.timestamp);

        emit DocumentMinted(newTokenId, to, cid, metadata, block.timestamp);
    }

    function getDocumentByCid(string calldata cid) external view returns (uint256 tokenId, address owner, string memory metadata, uint256 timestamp) {
        tokenId = _cidToTokenId[cid];
        require(tokenId != 0, "Document not found for this CID");
        Document storage doc = _documents[tokenId];
        owner = ownerOf(tokenId);
        metadata = doc.metadata;
        timestamp = doc.timestamp;
    }

    function tokenMetadata(uint256 tokenId) external view returns (string memory cid, string memory metadata, uint256 timestamp) {
        Document storage doc = _documents[tokenId];
        cid = doc.cid;
        metadata = doc.metadata;
        timestamp = doc.timestamp;
    }

    function burnDocument(uint256 tokenId) public {
        require(_checkApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner nor approved");
        _burn(tokenId);
        // Optionally, remove from _cidToTokenId mapping if desired, but not strictly necessary for ERC721 burn
        // For simplicity, we'll leave the cidToTokenId mapping as is, as the token no longer exists.
        emit DocumentBurned(tokenId, _msgSender());
    }

    function safeTransferOwner(uint256 tokenId, address to) public {
        require(_checkApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner nor approved");
        safeTransferFrom(_msgSender(), to, tokenId);
    }

    function _checkApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721Upgradeable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721Upgradeable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721Upgradeable, AccessControlUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    uint256[50] private __gap;
}