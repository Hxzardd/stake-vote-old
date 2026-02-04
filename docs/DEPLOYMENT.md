# StakeVoting Contract – Deployment

## Deploy with Remix (remix.polkadot.io)

You can deploy the contract in the browser using [Remix](https://remix.polkadot.io/).

### 1. Open Remix and add the contract

1. Go to **https://remix.polkadot.io/**.
2. In the **File Explorer** (left), create a new file, e.g. `StakeVoting.sol` (right‑click **contracts** → **New File**, or use the **+** icon).
3. Open your local `vote/contracts/StakeVoting.sol` in your editor, copy the full contents, and paste them into `StakeVoting.sol` in Remix. Save (Ctrl+S / Cmd+S).

### 2. Compile

1. Open the **Solidity Compiler** plugin (compiler icon in the left sidebar).
2. Set **Compiler** to **0.8.0** or later (e.g. 0.8.28). The contract uses `pragma ^0.8.0`.
3. Click **Compile StakeVoting.sol**.
4. Fix any errors (e.g. wrong compiler version) until you see a green check.

### 3. Deploy

1. Open the **Deploy & Run Transactions** plugin (Ethereum/Deploy icon).
2. **Environment**: choose one of:
   - **Remix VM (Shanghai)** – for a quick test (in-browser, no real network).
   - **Injected Provider** – to use MetaMask / Polkadot wallet and a real network (e.g. Moonbeam, Sepolia). Connect your wallet when prompted.
3. **Contract**: leave **StakeVoting** selected (it should appear after compile).
4. **Constructor parameters** – Remix shows one field per parameter. Fill them in order:

   | Parameter | Example value |
   |-----------|----------------|
   | **proposalDescription** (string) | `Should we allocate 100 ETH to grants?` |
   | **voters** (address[]) | `["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"]` |
   | **powers** (uint256[]) | `[1000, 500]` |
   | **votingDurationInBlocks** (uint256) | `100` (short for testing) or `17280` (~3 days) |
   | **quorumPercentage** (uint256) | `40` |

   Notes:
   - For **voters**, use a JSON array of addresses in quotes. Include at least your own address (e.g. from MetaMask “Account”) so you can vote after deploy. No `0x0`, no duplicates.
   - For **powers**, use a JSON array of numbers, same length as **voters**. Each value &gt; 0 (e.g. `[100, 50, 50]` for three voters).
   - For a quick test on Remix VM, 100 blocks is enough; for a real chain use e.g. 17280.

5. Click **Deploy** (or **transact**). Confirm in your wallet if you use Injected Provider.
6. After the transaction succeeds, the contract appears under **Deployed Contracts**. Copy the contract address (click the copy icon) and set it in your frontend (`vote/lib/contract.ts` → `CONTRACT_ADDRESS`).

### 4. If Remix asks for “ABI-encoded” constructor arguments

Some setups show a single **Calldata** / “Constructor arguments (ABI-encoded)” field. In that case:

1. Use a tool (e.g. [cast](https://book.getfoundry.sh/reference/cast/cast-abi-encode)) to encode the constructor:
   ```text
   constructor(string,address[],uint256[],uint256,uint256)
   ```
   with your `proposalDescription`, `voters[]`, `powers[]`, `votingDurationInBlocks`, `quorumPercentage`.
2. Paste the resulting hex into that single field and deploy.

Prefer filling the five separate fields if Remix shows them; it’s simpler.

---

## Prerequisites (Hardhat / Foundry)

- Node.js 18+
- Hardhat or Foundry (for compile/deploy and tests)
- Wallet with testnet ETH (e.g. Sepolia) for gas

For Foundry tests: `forge install foundry-rs/forge-std` (then run `forge test` from `vote/`).

## 1. Compile

**Hardhat**

```bash
cd vote
npx hardhat compile
```

**Foundry**

```bash
cd vote
forge build
```

(Ensure `contracts/StakeVoting.sol` is in `contracts/` and Foundry/Hardhat is configured to use `contracts/`.)

## 2. Constructor Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `proposalDescription` | string | Human-readable proposal text |
| `voters` | address[] | Snapshot of addresses with voting power |
| `powers` | uint256[] | Voting power per address (same length as `voters`) |
| `votingDurationInBlocks` | uint256 | Duration in blocks (e.g. 17280 ≈ 3 days on Ethereum) |
| `quorumPercentage` | uint256 | Quorum in percent, 0–100 (e.g. 40 = 40%) |

- No zero addresses, no zero power, no duplicate addresses.
- Contract is immutable after deployment (no upgrades).

## 3. Example Voting Power Snapshot

```javascript
const proposalDescription = "Should the DAO allocate 100 ETH to grants?"
const voters = [
  "0x1234567890123456789012345678901234567890",
  "0x2345678901234567890123456789012345678901",
  "0x3456789012345678901234567890123456789012",
]
const powers = [
  ethers.parseEther("1000"),  // 1000 units
  ethers.parseEther("500"),
  ethers.parseEther("250"),
]
const votingDurationInBlocks = 17280  // ~3 days (12s blocks)
const quorumPercentage = 40          // 40%
```

**Hardhat deploy script example**

```javascript
const { ethers } = require("hardhat")

async function main() {
  const [deployer] = await ethers.getSigners()
  const description = "Should the DAO allocate 100 ETH to grants?"
  const voters = [
    "0x1234567890123456789012345678901234567890",
    "0x2345678901234567890123456789012345678901",
  ]
  const powers = [ethers.parseEther("1000"), ethers.parseEther("500")]
  const duration = 17280
  const quorum = 40

  const StakeVoting = await ethers.getContractFactory("StakeVoting")
  const contract = await StakeVoting.deploy(description, voters, powers, duration, quorum)
  await contract.waitForDeployment()
  const address = await contract.getAddress()
  console.log("StakeVoting deployed to:", address)
}
main().catch(console.error)
```

**Foundry deploy**

```bash
forge create contracts/StakeVoting.sol:StakeVoting \
  --constructor-args $(cast abi-encode "constructor(string,address[],uint256[],uint256,uint256)" \
    "Should we allocate 100 ETH to grants?" \
    "[0x1234...,0x5678...]" \
    "[1000,500]" \
    17280 \
    40) \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

Adjust encoding for your tool (e.g. use a script for complex constructor args).

## 4. Wire Frontend

After deployment:

1. Copy the deployed contract address.
2. In `vote/lib/contract.ts`, set:
   ```ts
   export const CONTRACT_ADDRESS = '0xYourDeployedAddress'
   ```
3. ABI is already set in `CONTRACT_ABI` (and full JSON at `contracts/abi/StakeVoting.json`).

## 5. Networks

- **Sepolia (recommended for testing):** get ETH from a faucet, set `RPC_URL` to Sepolia.
- **Mainnet:** use only after tests; contract is immutable.

## 6. Verify on Etherscan

After deploy, verify the contract (e.g. Hardhat Etherscan plugin or Foundry `forge verify-contract`) so the block explorer shows the source and ABI.
