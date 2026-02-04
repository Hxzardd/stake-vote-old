// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title StakeVoting
 * @notice Snapshot-based governance contract. Single proposal, one vote per address,
 *         weighted by assigned stake. No tokenization or identity management.
 */
contract StakeVoting {
    // ---------- Events ----------
    event VoteCast(address indexed voter, bool support, uint256 votingPower);

    // ---------- State ----------
    string private _proposalDescription;
    uint256 private _votingDeadlineBlock;
    uint256 private _quorumPercentage;
    uint256 private _yesVotes;
    uint256 private _noVotes;
    uint256 private _totalVotingPower;

    mapping(address => uint256) private _votingPower;
    mapping(address => bool) private _hasVoted;

    // ---------- Constructor ----------
    /**
     * @param proposalDescription Human-readable proposal text
     * @param voters Array of addresses with voting power
     * @param powers Array of voting power per address (same length as voters)
     * @param votingDurationInBlocks Duration in blocks (e.g. 17280 ≈ 3 days on Ethereum)
     * @param quorumPercentage Quorum required in percent (0-100, e.g. 40 = 40%)
     */
    constructor(
        string memory proposalDescription,
        address[] memory voters,
        uint256[] memory powers,
        uint256 votingDurationInBlocks,
        uint256 quorumPercentage
    ) {
        require(bytes(proposalDescription).length > 0, "StakeVoting: empty description");
        require(voters.length == powers.length, "StakeVoting: length mismatch");
        require(voters.length > 0, "StakeVoting: no voters");
        require(quorumPercentage <= 100, "StakeVoting: quorum > 100");
        require(votingDurationInBlocks > 0, "StakeVoting: zero duration");

        _proposalDescription = proposalDescription;
        _votingDeadlineBlock = block.number + votingDurationInBlocks;
        _quorumPercentage = quorumPercentage;

        uint256 total = 0;
        for (uint256 i = 0; i < voters.length; i++) {
            require(voters[i] != address(0), "StakeVoting: zero address");
            require(powers[i] > 0, "StakeVoting: zero power");
            require(_votingPower[voters[i]] == 0, "StakeVoting: duplicate voter");
            _votingPower[voters[i]] = powers[i];
            total += powers[i];
        }
        _totalVotingPower = total;
    }

    // ---------- Required (frontend) ----------

    /** @return description The proposal text */
    function getProposal() external view returns (string memory description) {
        return _proposalDescription;
    }

    /** @return yesVotes Total weight of yes votes */
    /** @return noVotes Total weight of no votes */
    function getVoteCounts() external view returns (uint256 yesVotes, uint256 noVotes) {
        return (_yesVotes, _noVotes);
    }

    /** @return votingPower Stake assigned to voter at snapshot (0 if not in snapshot) */
    function getUserVotingPower(address voter) external view returns (uint256 votingPower) {
        return _votingPower[voter];
    }

    /** @return Whether the voter has already cast a vote */
    function hasUserVoted(address voter) external view returns (bool) {
        return _hasVoted[voter];
    }

    /**
     * Records a vote. Reverts if caller has no power, already voted, or after deadline.
     * @param support true = yes, false = no
     */
    function vote(bool support) external {
        uint256 power = _votingPower[msg.sender];
        require(power > 0, "StakeVoting: no voting power");
        require(!_hasVoted[msg.sender], "StakeVoting: already voted");
        require(block.number < _votingDeadlineBlock, "StakeVoting: voting ended");

        _hasVoted[msg.sender] = true;
        if (support) {
            _yesVotes += power;
        } else {
            _noVotes += power;
        }

        emit VoteCast(msg.sender, support, power);
    }

    // ---------- Recommended ----------

    /** @return blockTimestamp The block number at which voting ends */
    function getProposalDeadline() external view returns (uint256 blockTimestamp) {
        return _votingDeadlineBlock;
    }

    /** @return Quorum in percent (e.g. 40 = 40%) */
    function getQuorumPercentage() external view returns (uint256) {
        return _quorumPercentage;
    }

    /** @return Sum of all assigned stakes */
    function getTotalVotingPower() external view returns (uint256) {
        return _totalVotingPower;
    }

    /**
     * @return "Active" | "Passed" | "Rejected" | "Expired"
     *         Active: before deadline
     *         Expired: at or after deadline
     *         Passed: expired and yes votes meet quorum
     *         Rejected: expired and not passed
     */
    function getProposalStatus() external view returns (string memory) {
        if (block.number < _votingDeadlineBlock) {
            return "Active";
        }
        if (_totalVotingPower == 0) {
            return "Expired";
        }
        uint256 yesPercent = (_yesVotes * 100) / _totalVotingPower;
        if (yesPercent >= _quorumPercentage) {
            return "Passed";
        }
        return "Rejected";
    }

    // ---------- Internal helpers (none; all logic inline) ----------
}
