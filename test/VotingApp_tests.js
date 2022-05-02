const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

let VotingApp;
let VotingApp_Contract;
let owner
let candidateNames = ["Maikel", "Junior", "Ian", "Gabriel", "Herly", "Goku", "Vegeta"];
let Alice;
let Bob;
let Charlie;

beforeEach(async function () {
    
    VotingApp = await ethers.getContractFactory("VotingApp");
    [owner, Alice, Bob, Charlie] = await ethers.getSigners();
    VotingApp_Contract = await VotingApp.deploy();

});

describe("Deployment", function () {
    
    it("Should set the right owner", async function () {

        expect(await VotingApp_Contract.owner()).to.equal(owner.address);

      });
});

describe("Functions", function () {

      it("should test the function to register new candidates", async function () {          
            
            //Can only register five candidates
            await expect(VotingApp_Contract.newcandidate(candidateNames[0]))
            .to.emit(VotingApp_Contract,"NewCandidate")
            .withArgs(candidateNames[0]); 
            
            await expect(VotingApp_Contract.newcandidate(candidateNames[1]))
            .to.emit(VotingApp_Contract,"NewCandidate")
            .withArgs(candidateNames[1]); 

            await expect(VotingApp_Contract.newcandidate(candidateNames[2]))
            .to.emit(VotingApp_Contract,"NewCandidate")
            .withArgs(candidateNames[2]); 

            await expect(VotingApp_Contract.newcandidate(candidateNames[3]))
            .to.emit(VotingApp_Contract,"NewCandidate")
            .withArgs(candidateNames[3]); 

            await expect(VotingApp_Contract.newcandidate(candidateNames[4]))
            .to.emit(VotingApp_Contract,"NewCandidate")
            .withArgs(candidateNames[4]); 

            // Ther can not be more than five candidates
            await expect(VotingApp_Contract.newcandidate(candidateNames[5]))
            .to.be.revertedWith("There can not be more candidates.");

            // Only the owner can register candidates            
            await expect(VotingApp_Contract.connect(Alice).newcandidate(candidateNames[1]))
            .to.be.revertedWith("Contact the admin to register as a candidate.");                  
      });

      it("should test function to register new voters", async function () {          
            
            await expect(VotingApp_Contract.connect(Alice).newVoter())
            .to.emit(VotingApp_Contract,"NewUser")
            .withArgs("A new voter has registered.");  
            
            await expect(VotingApp_Contract.connect(Bob).newVoter())
            .to.emit(VotingApp_Contract,"NewUser")
            .withArgs("A new voter has registered."); 

            await expect(VotingApp_Contract.connect(Charlie).newVoter())
            .to.emit(VotingApp_Contract,"NewUser")
            .withArgs("A new voter has registered."); 

                       
      });

      it("should test the vote function", async function () {          
            
            await expect(VotingApp_Contract.connect(Alice).vote(1))
            .to.emit(VotingApp_Contract,"aVoterHasVoted")
            .withArgs("We have a new vote count.");  

            await expect(VotingApp_Contract.connect(Bob).vote(1))
            .to.emit(VotingApp_Contract,"aVoterHasVoted")
            .withArgs("We have a new vote count."); 
            
            await expect(VotingApp_Contract.connect(Charlie).vote(1))
            .to.emit(VotingApp_Contract,"aVoterHasVoted")
            .withArgs("We have a new vote count.");  

            // should fail if the voter has already voted
            await expect(VotingApp_Contract.connect(Alice).vote(1))
            .to.be.revertedWith("You already voted.");            
      });

      it("should test the function to select the winner", async function () {          
            
            const winner = await VotingApp_Contract.winner();
            console.log(winner);       
      });

      


});

     
