const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

let VotingApp;
let hardhatVotingApp;
let owner;
let candidateNames = ["Candidate 1", "Candidate 2"];
let addr1;
let addr2;
let addrs;

beforeEach(async function () {
    
    VotingApp = await ethers.getContractFactory("VotingApp");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    hardhatVotingApp = await VotingApp.deploy();

});

describe("Deployment", function () {
    
    it("Should set the right owner", async function () {

        expect(await hardhatVotingApp.owner()).to.equal(owner.address);

      });
});

describe("_newcandidate", function () {

      it("should register new candidates", async function () {

            const result = await hardhatVotingApp._newcandidate(candidateNames[0]);
            expect(result == "Candidate 1");

      });
});