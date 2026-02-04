import companySharesAbi from "./CompanySharesABI.json";
import stakeVotingAbi from "./StakeWeightedVotingABI.json";

// Remix VM addresses (TEMP — replace with testnet later)
export const COMPANY_SHARES_ADDRESS =
  "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B";

export const STAKE_VOTING_ADDRESS =
  "0xDA0bAb807633f07F013f94DD0E6A4F96F8742B53";

export const companySharesContract = {
  address: COMPANY_SHARES_ADDRESS,
  abi: companySharesAbi,
};

export const stakeVotingContract = {
  address: STAKE_VOTING_ADDRESS,
  abi: stakeVotingAbi,
};
