const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const DocumentNFT = await ethers.getContractFactory("DocumentNFT");
  const documentNFT = await upgrades.deployProxy(DocumentNFT, ["DocumentNFT", "DCNFT", deployer.address], {
    initializer: "initialize",
  });

  await documentNFT.waitForDeployment();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(await documentNFT.getAddress());

  console.log("DocumentNFT deployed to:", await documentNFT.getAddress());
  console.log("DocumentNFT implementation deployed to:", implementationAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });