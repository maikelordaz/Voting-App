const hre = require("hardhat");

async function main() {

  const VotingApp = await hre.ethers.getContractFactory("VotingApp");
  const hardhatVotingApp = await VotingApp.deploy("Voting App");

  await hardhatVotingApp.deployed();

  console.log("VotingApp deployed to:", hardhatVotingApp.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
