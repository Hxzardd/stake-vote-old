import { BrowserProvider, Contract } from "ethers";
import { stakeVotingContract } from "../contracts/contracts";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function getStakeVotingContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new Contract(
    stakeVotingContract.address,
    stakeVotingContract.abi,
    signer
  );
}
