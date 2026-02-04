import companySharesAbi from "./CompanySharesABI.json";
import stakeVotingAbi from "./StakeWeightedVotingABI.json";

// TEMP: Remix VM addresses (replace later with testnet addresses)
export const COMPANY_SHARES_ADDRESS = "PASTE_COMPANY_SHARES_ADDRESS_HERE";
export const STAKE_VOTING_ADDRESS = "PASTE_STAKE_WEIGHTED_VOTING_ADDRESS_HERE";

export const companySharesContract = {
  address: 0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B,
  abi: companySharesAbi,
};

export const stakeVotingContract = {
  address: 0xDA0bab807633f07f013f94DD0E6A4F96F8742B53,
  abi: stakeVotingAbi,
};
