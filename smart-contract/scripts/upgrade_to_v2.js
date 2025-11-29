const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Upgrading contracts with the account:", deployer.address);

  const proxyAddress = process.env.PROXY_ADDRESS; // Asegúrate de establecer esta variable de entorno

  if (!proxyAddress) {
    console.error("PROXY_ADDRESS environment variable not set.");
    process.exit(1);
  }

  const DocumentNFT_v2 = await ethers.getContractFactory("DocumentNFT_v2");
  const documentNFT_v2 = await upgrades.upgradeProxy(proxyAddress, DocumentNFT_v2);

  await documentNFT_v2.waitForDeployment();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(await documentNFT_v2.getAddress());

  console.log("DocumentNFT upgraded to v2 at:", await documentNFT_v2.getAddress());
  console.log("DocumentNFT_v2 implementation deployed to:", implementationAddress);

  // Verificar la nueva función version()
  const version = await documentNFT_v2.version();
  console.log("New contract version:", version);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });