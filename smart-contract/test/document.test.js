const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("DocumentNFT", function () {
  let DocumentNFT;
  let DocumentNFT_v2;
  let documentNFT;
  let owner;
  let addr1;
  let addr2;
  let adminRole;
  let upgraderRole;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    DocumentNFT = await ethers.getContractFactory("DocumentNFT");
    DocumentNFT_v2 = await ethers.getContractFactory("DocumentNFT_v2");

    // Deploy proxy with initializer
    documentNFT = await upgrades.deployProxy(DocumentNFT, ["DocumentNFT", "DCNFT", owner.address], {
      initializer: "initialize",
    });
    await documentNFT.waitForDeployment();

    adminRole = await documentNFT.DEFAULT_ADMIN_ROLE();
    upgraderRole = await documentNFT.UPGRADER_ROLE();
  });

  describe("Initialization", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await documentNFT.name()).to.equal("DocumentNFT");
      expect(await documentNFT.symbol()).to.equal("DCNFT");
    });

    it("Should assign DEFAULT_ADMIN_ROLE and UPGRADER_ROLE to the admin", async function () {
      expect(await documentNFT.hasRole(adminRole, owner.address)).to.be.true;
      expect(await documentNFT.hasRole(upgraderRole, owner.address)).to.be.true;
    });

    it("Should not allow re-initialization", async function () {
      await expect(documentNFT.initialize("NewName", "NNFT", owner.address)).to.be.revertedWith(
        "Initializable: contract is already initialized"
      );
    });
  });

  describe("Minting", function () {
    it("Should mint a unique document and emit DocumentMinted event", async function () {
      const cid = "0x1234567890123456789012345678901234567890123456789012345678901234";
      const metadata = "{\"name\":\"Test Document\", \"type\":\"pdf\"}";

      await expect(documentNFT.mintDocument(addr1.address, cid, metadata))
        .to.emit(documentNFT, "DocumentMinted")
        .withArgs(1, addr1.address, cid, metadata, (await ethers.provider.getBlock("latest")).timestamp);

      expect(await documentNFT.ownerOf(1)).to.equal(addr1.address);
      const [retrievedTokenId, retrievedOwner, retrievedMetadata, retrievedTimestamp] = await documentNFT.getDocumentByCid(cid);
      expect(retrievedTokenId).to.equal(1);
      expect(retrievedOwner).to.equal(addr1.address);
      expect(retrievedMetadata).to.equal(metadata);
      expect(retrievedTimestamp).to.be.a('bigint');
    });

    it("Should reject minting with an empty CID", async function () {
      const cid = "";
      const metadata = "{}";
      await expect(documentNFT.mintDocument(addr1.address, cid, metadata)).to.be.revertedWith("CID cannot be empty");
    });

    it("Should reject minting with an existing CID", async function () {
      const cid = "0x1234567890123456789012345678901234567890123456789012345678901234";
      const metadata = "{}";

      await documentNFT.mintDocument(addr1.address, cid, metadata);
      await expect(documentNFT.mintDocument(addr2.address, cid, metadata)).to.be.revertedWith("Document with this CID already exists");
    });

    it("Should fail if account without admin role tries to mint", async function () {
      const cid = "0xabcdef";
      const metadata = "{}";
      await expect(documentNFT.connect(addr1).mintDocument(addr1.address, cid, metadata)).to.be.revertedWith(
        `AccessControl: account ${addr1.address.toLowerCase()} is missing role ${adminRole}`
      );
    });
  });

  describe("Burning", function () {
    it("Should allow owner to burn their document and emit DocumentBurned event", async function () {
      const cid = "0x1111111111111111111111111111111111111111111111111111111111111111";
      const metadata = "{}";
      await documentNFT.mintDocument(addr1.address, cid, metadata);

      await expect(documentNFT.connect(addr1).burnDocument(1))
        .to.emit(documentNFT, "DocumentBurned")
        .withArgs(1, addr1.address);

      await expect(documentNFT.ownerOf(1)).to.be.revertedWith("ERC721: invalid token ID");
      await expect(documentNFT.getDocumentByCid(cid)).to.be.revertedWith("Document not found for this CID");
    });

    it("Should allow admin to burn any document", async function () {
      const cid = "0x2222222222222222222222222222222222222222222222222222222222222222";
      const metadata = "{}";
      await documentNFT.mintDocument(addr1.address, cid, metadata);

      await expect(documentNFT.burnDocument(1))
        .to.emit(documentNFT, "DocumentBurned")
        .withArgs(1, owner.address);

      await expect(documentNFT.ownerOf(1)).to.be.revertedWith("ERC721: invalid token ID");
    });

    it("Should not allow non-owner/non-admin to burn a document", async function () {
      const cid = "0x3333333333333333333333333333333333333333333333333333333333333333";
      const metadata = "{}";
      await documentNFT.mintDocument(addr1.address, cid, metadata);

      await expect(documentNFT.connect(addr2).burnDocument(1)).to.be.revertedWith(
        "ERC721: caller is not token owner nor approved"
      );
    });
  });

  describe("Upgradeability", function () {
    it("Should allow upgrade to v2 and preserve data", async function () {
      const cid1 = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      const metadata1 = "{\"name\":\"Doc A\"}";
      await documentNFT.mintDocument(addr1.address, cid1, metadata1);

      const cid2 = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
      const metadata2 = "{\"name\":\"Doc B\"}";
      await documentNFT.mintDocument(addr2.address, cid2, metadata2);

      const documentNFT_v2_upgraded = await upgrades.upgradeProxy(await documentNFT.getAddress(), DocumentNFT_v2);

      // Check new function from v2
      expect(await documentNFT_v2_upgraded.version()).to.equal("v2");

      // Check if old data is preserved
      const [retrievedTokenId1, retrievedOwner1, retrievedMetadata1, retrievedTimestamp1] = await documentNFT_v2_upgraded.getDocumentByCid(cid1);
      expect(retrievedTokenId1).to.equal(1);
      expect(retrievedOwner1).to.equal(addr1.address);
      expect(retrievedMetadata1).to.equal(metadata1);

      const [retrievedTokenId2, retrievedOwner2, retrievedMetadata2, retrievedTimestamp2] = await documentNFT_v2_upgraded.getDocumentByCid(cid2);
      expect(retrievedTokenId2).to.equal(2);
      expect(retrievedOwner2).to.equal(addr2.address);
      expect(retrievedMetadata2).to.equal(metadata2);

      // Mint new document after upgrade
      const cid3 = "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";
      const metadata3 = "{\"name\":\"Doc C\"}";
      await expect(documentNFT_v2_upgraded.mintDocument(addr1.address, cid3, metadata3))
        .to.emit(documentNFT_v2_upgraded, "DocumentMinted")
        .withArgs(3, addr1.address, cid3, metadata3, (await ethers.provider.getBlock("latest")).timestamp);

      const [retrievedTokenId3, retrievedOwner3, retrievedMetadata3, retrievedTimestamp3] = await documentNFT_v2_upgraded.getDocumentByCid(cid3);
      expect(retrievedTokenId3).to.equal(3);
      expect(retrievedOwner3).to.equal(addr1.address);
      expect(retrievedMetadata3).to.equal(metadata3);
    });

    it("Should not allow non-upgrader role to upgrade", async function () {
      await expect(upgrades.upgradeProxy(await documentNFT.getAddress(), DocumentNFT_v2.connect(addr1))).to.be.revertedWith(
        `AccessControl: account ${addr1.address.toLowerCase()} is missing role ${upgraderRole}`
      );
    });
  });
});