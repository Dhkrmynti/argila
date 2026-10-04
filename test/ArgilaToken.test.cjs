const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ArgilaToken", function () {
  let token, deployer, other;

  beforeEach(async function () {
    [deployer, other] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("ArgilaToken");
    token = await Token.deploy();
    await token.waitForDeployment();
  });

  it("has the Argila name, ARGL symbol and 18 decimals", async function () {
    expect(await token.name()).to.equal("Argila");
    expect(await token.symbol()).to.equal("ARGL");
    expect(await token.decimals()).to.equal(18n);
  });

  it("mints the fixed 10,000,000 supply to the deployer", async function () {
    const supply = ethers.parseUnits("10000000", 18);
    expect(await token.totalSupply()).to.equal(supply);
    expect(await token.balanceOf(deployer.address)).to.equal(supply);
  });

  it("exposes no mint function at all", async function () {
    expect(token.interface.fragments.some((f) => f.type === "function" && f.name === "mint")).to.equal(false);
  });

  it("transfers like a normal ERC20 and keeps supply constant", async function () {
    await token.transfer(other.address, ethers.parseUnits("5", 18));
    expect(await token.balanceOf(other.address)).to.equal(ethers.parseUnits("5", 18));
    expect(await token.totalSupply()).to.equal(ethers.parseUnits("10000000", 18));
  });
});
