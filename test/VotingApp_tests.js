const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

let VotingApp;
let VotingApp_Contract;
let owner
let candidateNames = ["Maikel", "Junior"];
let addr1;
let addr2;
let addrs;

beforeEach(async function () {
    
    VotingApp = await ethers.getContractFactory("VotingApp");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    VotingApp_Contract = await VotingApp.deploy();

});

describe("Deployment", function () {
    
    it("Should set the right owner", async function () {

        expect(await VotingApp_Contract.owner()).to.equal(owner.address);

      });
});

describe("_newcandidate", function () {

      it("should register new candidates", async function () {

            const result = await VotingApp_Contract._newcandidate(candidateNames[0]);
            await expect(result == "Maikel");
            await expect(VotingApp_Contract._newcandidate(candidateNames[0]))
            .to.emit(VotingApp_Contract,"NewCandidate")
            .withArgs(candidateNames[0]);
            console.log("The new candidate is", candidateNames[0]);
      });
});

/* Debo terminar las siguientes pruebas
describe("_newVoter", function () {

      it("should register new user as a voter", async function () {
            
            await VotingApp_Contract._newVoter(addr1.address);
            await expect(VotingApp_Contract.voters[addr1.address].voted).to.equal(true);
            await expect(VotingApp_Contract._newVoter(addr1.address))
            .to.emit(VotingApp_Contract,"NewUser")
            .withArgs(addr1.address);
                   
      
      });
});*/

it("should start the ballot", async function () {

      await VotingApp_Contract.Start();
     
});