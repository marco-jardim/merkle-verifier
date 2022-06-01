const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require('merkletreejs')

describe("Verifier", async () => {

  before(async function () {
    this.Verifier = await ethers.getContractFactory("Verifier");
    [ this.owner ] = await ethers.getSigners();
    this.ownerAddress = await this.owner.getAddress();
  });

  beforeEach(async function () {
    this.verifier = await this.Verifier.deploy();
    await this.verifier.deployed();
  });
    
  it("should be deployed", async function () {
    expect(this.verifier.address).to.not.be.undefined;
    expect(this.verifier.address).to.not.be.null;
  });

  it("should have a default value", async function () {
    expect(await this.verifier.getRoot(this.ownerAddress)).to.equal(
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    );
  });

  it("should set a new Root", async function () {
    const bytes = ethers.utils.toUtf8Bytes("newRoot")
    const newRoot = ethers.utils.keccak256(bytes);
    const setRoot = await this.verifier.setRoot(newRoot);
    setRoot.wait();
    expect(await this.verifier.getMyRoot()).to.equal(newRoot);
  });

  it("should get proof of inclusion", async function () {
    const leaves = ['a', 'b', 'c'].map(x => ethers.utils.toUtf8Bytes(x)); // transform to bytes
    const tree = new MerkleTree(leaves, ethers.utils.keccak256, {sortPairs: true, hashLeaves: true});
    const root = tree.getHexRoot();
    const leaf = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('a'));
    const notLeaf = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('d'));
    const proof = tree.getHexProof(leaf);
  
    const setRoot = await this.verifier.setRoot(tree.getRoot());
    setRoot.wait();
    expect(await this.verifier.getMyRoot()).to.equal(root);
    expect(await this.verifier.verify(leaf, proof)).to.equal(true);
    expect(await this.verifier.verify(notLeaf, proof)).to.equal(false);
  });
  
});