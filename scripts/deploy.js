const { ethers } = require("hardhat");

async function main() {

  // 🪙 Deploy RewardToken
  const Token = await ethers.getContractFactory("RewardToken");
  const token = await Token.deploy();
  await token.waitForDeployment();

  console.log("RewardToken deployed at:", await token.getAddress());

  // 🏦 Deploy Vault
  const Vault = await ethers.getContractFactory("SecureVault");
  const vault = await Vault.deploy(await token.getAddress());
  await vault.waitForDeployment();

  console.log("SecureVault deployed at:", await vault.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});