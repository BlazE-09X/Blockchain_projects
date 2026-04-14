import { ethers } from "ethers";
import hre from "hardhat";

async function main() {
  const proposals = [
    ethers.encodeBytes32String("Proposal 1"),
    ethers.encodeBytes32String("Proposal 2"),
    ethers.encodeBytes32String("Proposal 3")
  ];

  console.log("Deploying Ballot with proposals:", proposals);

  // берём RPC из конфига
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  // получаем артефакт контракта
  const artifact = await hre.artifacts.readArtifact("Ballot");

  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );

  const contract = await factory.deploy(proposals);

  await contract.waitForDeployment();

  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});