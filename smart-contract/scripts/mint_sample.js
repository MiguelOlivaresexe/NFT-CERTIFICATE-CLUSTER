const { ethers } = require("hardhat");

async function main() {
  const [minter] = await ethers.getSigners();

  console.log("Minting document with the account:", minter.address);

  const proxyAddress = process.env.PROXY_ADDRESS; // Asegúrate de establecer esta variable de entorno

  if (!proxyAddress) {
    console.error("PROXY_ADDRESS environment variable not set.");
    process.exit(1);
  }

  const DocumentNFT = await ethers.getContractFactory("DocumentNFT");
  const documentNFT = DocumentNFT.attach(proxyAddress);

  const cid = "0x" + Math.random().toString(16).substr(2, 32).padStart(32, "0"); // CID de ejemplo
  const metadata = JSON.stringify({ name: "Sample Document", description: "This is a sample document NFT." });

  console.log("Minting document with CID:", cid);

  const tx = await documentNFT.mintDocument(minter.address, cid, metadata);
  await tx.wait();

  const tokenId = await documentNFT.getDocumentByCid(cid);

  console.log("Document minted with Token ID:", tokenId.tokenId);
  console.log("Transaction hash:", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });