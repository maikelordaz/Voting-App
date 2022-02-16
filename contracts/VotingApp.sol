// SPDX-License-Identifier: unlicensed
/* 
@title: VotingApp
@author: Maikel Ordaz
*/

pragma solidity ^0.8.0;
import "hardhat/console.sol";
contract VotingApp {

// VARIABLES

    address public owner;

        // A structure for each candidate
    struct Candidate {
        string nameOfTheCandidate; //The name of the candidate
        uint voteCount; //The votes that the candidate have received
    }

    Candidate[] public candidates; 

    //A structure for every voter
    struct User {
        uint8 admit; //1 when the user is registered and 0 when not  
        uint vote; //To check for whom the user has voted, is the position on the array candidates
        bool voted; //true when already voted and false when not        
    }

    uint time;
    uint public timePassed;

    mapping(address => User) public voters;
    mapping(address => Candidate) public candidateAddress;

    enum Status {Started, onGoing, Ended}
    Status public status;

//MODIFIERS

    modifier actualStatus(Status _status) {
        require(status == _status);
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
    
    //A function to register a Candidate
    function _newcandidate(string memory candidateNames) 
        public {
            //The owner of the contract can register up to five candidates
            require
                (msg.sender == owner,
                "Contact the admin to register as a candidate.");
            for (uint i = 0; i < 5; i++) {
                candidates.push(Candidate({nameOfTheCandidate: candidateNames, voteCount: 0}));
                emit NewCandidate(candidateNames);
            }

            status = Status.Started;
    }

    //A function to register a user as a voter
    function _newVoter(address user) 
        public
        actualStatus(Status.Started){

            //One condition where the owner has to admit the user
            require
                (msg.sender == owner,
                "Contact the admin to register as a voter.");
            
            //One condition to check if the user has already voted
            require
                (!voters[user].voted,
                "Already voted.");
            
            //One condition to check if the user has already registered, according to the condittions of admit on the User struct
            require
                (voters[user].admit == 0);

            //If all the conditions are passed the user is registered as a new voter and the admit value is now "1"
            voters[user].admit = 1;
            emit NewUser("A new voter has registered.");
    }

    //A function to start the ballot
    function Start()
        public
        actualStatus(Status.Started){

            require
                (msg.sender == owner,
                "You can not start the ballot.");
            time = block.timestamp; //To check the moment that the ballot started
            status = Status.onGoing;
    }

    //A function to make the ballot
    function vote(uint candidate) 
        public
        actualStatus(Status.onGoing) {

            User storage user = voters[msg.sender];
            
            //One condition to check if the user has registered as a voter
            require
                (user.admit != 0,
                "You can not vote.");
            
            //One condition to check if the voter has already voted
            require
                (user.voted,
                 "Already voted.");
            
            user.voted = true;
            user.vote = candidate; //The voter emit his vote according to the index of the candidate on the array candidates
            candidates[candidate].voteCount++; //Evaluate the array and incremet the vote count of the candidate 1 vote
            emit aVoterHasVoted("We have a new vote count.");
    }
    
    //A function to finish the ballot
    function Finish()
        public
        actualStatus(Status.onGoing){

            require
                (msg.sender == owner,
                "You can not finish the ballot.");
            timePassed = block.timestamp; //To check the actual time

            //One condition to compare how many days have passed since the ballot started
            if (time + 1 weeks == timePassed) {
            status = Status.Ended;
            }
    }

    //A function to declare the winner of the ballot
    function winner() 
        public 
        view 
        actualStatus(Status.Ended) 
        returns (string memory _winnerCandidate) {

            uint _winner;
            uint winningVoteCount = 0;

            //A loop to iterate through the candidates array
            for (uint j = 0; j < candidates.length; j++) {

                //A condition to check which voteCount is higher
                if (candidates[j].voteCount > winningVoteCount) {
                    winningVoteCount = candidates[j].voteCount;
                    _winner = j; //The index of the winner candidate
                }
            }
            _winnerCandidate = candidates[_winner].nameOfTheCandidate; 
            return _winnerCandidate;
    }
}