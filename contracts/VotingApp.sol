// SPDX-License-Identifier: unlicensed
/** 
@title: VotingApp
@author: Maikel Ordaz
*/

pragma solidity ^0.8.0;
contract VotingApp {

// VARIABLES

    address public owner;
    struct Candidate {
        string nameOfTheCandidate; 
        uint voteCount;        
    }    
    uint candidateId = 0;

    struct User {
        uint candidateSelected; 
        bool voted;     
    }

    uint time;
    uint public timePassed;

    mapping(address => User) public idToVoter;
    mapping(uint => Candidate) public IdToCandidate;

    enum Status {Started, onGoing, Ended}
    Status public status;

//MODIFIERS

    modifier onlyOwner() {
        require(msg.sender == owner, "Contact the admin to register as a candidate.");
        _;
    }
   
//EVENTS

    event NewCandidate(string candidateName);
    event NewUser(string);
    event aVoterHasVoted(string);

// FUNCTIONS 

    constructor(){
        owner = msg.sender;
    }        
    
    function newcandidate(string memory candidateNames) 
    public 
    onlyOwner{            

        require(candidateId < 5, "There can not be more candidates.");          
        IdToCandidate[candidateId] = Candidate (candidateNames, 0);
        candidateId++;
        emit NewCandidate(candidateNames);            
                  
    }

    function newVoter() 
    public {
                       
        idToVoter[msg.sender] = User (0, false);
        emit NewUser("A new voter has registered.");
    }
    
    function vote(uint candId) 
    public {
           
        require(idToVoter[msg.sender].voted == false, "You already voted.");  
        idToVoter[msg.sender] = User (candId, true);              
        IdToCandidate[candId].voteCount++;
        emit aVoterHasVoted("We have a new vote count.");
    }

    function winner() 
    public 
    view 
    returns (string memory _winnerCandidate) {

        uint _winner;
        uint winningVoteCount = 0;
        for (uint j = 0 ; j < 5; j++) {
            if (IdToCandidate[j].voteCount > winningVoteCount) {
                winningVoteCount = IdToCandidate[j].voteCount;
                _winner = j;
                }
        }
        _winnerCandidate = IdToCandidate[_winner].nameOfTheCandidate; 
        return _winnerCandidate;
    }
}