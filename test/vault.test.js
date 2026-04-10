const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SecureVault", function () {

  let token, vault, owner, user;

  beforeEach(async function () {

    [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("RewardToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    const Vault = await ethers.getContractFactory("SecureVault");
    vault = await Vault.deploy(await token.getAddress());
    await vault.waitForDeployment();

    await token.transfer(user.address, ethers.parseEther("100"));
    await token.connect(user).approve(await vault.getAddress(), ethers.parseEther("100"));
  });

  it("Should deposit tokens", async function () {
    await vault.connect(user).deposit(ethers.parseEther("10"));

    const balance = await vault.balances(user.address);
    expect(balance).to.equal(ethers.parseEther("10"));
  });

  it("Should withdraw tokens", async function () {
    await vault.connect(user).deposit(ethers.parseEther("10"));
    await vault.connect(user).withdraw(ethers.parseEther("5"));

    const balance = await vault.balances(user.address);
    expect(balance).to.equal(ethers.parseEther("5"));
  });

  it("Should fail if insufficient balance", async function () {
    await expect(
      vault.connect(user).withdraw(ethers.parseEther("10"))
    ).to.be.revertedWith("Insufficient balance");
  });

  it("Should fail for zero deposit", async function () {
    await expect(
      vault.connect(user).deposit(0)
    ).to.be.revertedWith("Amount must be > 0");
  });

});