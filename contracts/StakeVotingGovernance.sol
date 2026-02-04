// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StakeVotingGovernance {
    /* State machine */

    enum Phase {
        Created,
        Voting,
        Ended
    }

    Phase public phase;

    /* State */

    address public chairperson;
    string public proposalDescription;

    uint256 public totalVotingPower;
    uint256 public yesVotes;
    uint256 public noVotes;

    uint256 public quorumBps;

    mapping(address => uint256) public stake;
    mapping(address => bool) public hasVoted;

    /* Events */

    event ProposalCreated(string description);
    event StakeAssigned(address indexed voter, uint256 amount);
    event VotingStarted();
    event VotingEnded();
    event VoteCast(address indexed voter, bool support, uint256 weight);

    /* Constructor */

    constructor(uint256 _quorumBps) {
        require(_quorumBps > 0 && _quorumBps <= 10_000, "Invalid quorum");

        chairperson = msg.sender;
        quorumBps = _quorumBps;
        phase = Phase.Created;
    }

    /* Modifiers */

    modifier onlyChairperson() {
        require(msg.sender == chairperson, "Only chairperson");
        _;
    }

    modifier inPhase(Phase p) {
        require(phase == p, "Invalid phase");
        _;
    }

    /* Admin (Created) */

    function setProposal(string calldata description)
        external
        onlyChairperson
        inPhase(Phase.Created)
    {
        require(bytes(description).length > 0, "Empty proposal");
        proposalDescription = description;
        emit ProposalCreated(description);
    }

    function assignStake(address voter, uint256 amount)
        external
        onlyChairperson
        inPhase(Phase.Created)
    {
        require(voter != address(0), "Invalid address");
        require(amount > 0, "Zero stake");
        require(stake[voter] == 0, "Already assigned");

        stake[voter] = amount;
        totalVotingPower += amount;

        emit StakeAssigned(voter, amount);
    }

    function startVoting()
        external
        onlyChairperson
        inPhase(Phase.Created)
    {
        require(bytes(proposalDescription).length > 0, "No proposal");
        require(totalVotingPower > 0, "No stake");

        phase = Phase.Voting;
        emit VotingStarted();
    }

    /* Admin (Voting → Ended) */

    function endVoting()
        external
        onlyChairperson
        inPhase(Phase.Voting)
    {
        phase = Phase.Ended;
        emit VotingEnded();
    }

    /* Voting */

    function vote(bool support)
        external
        inPhase(Phase.Voting)
    {
        uint256 weight = stake[msg.sender];
        require(weight > 0, "No stake");
        require(!hasVoted[msg.sender], "Already voted");

        hasVoted[msg.sender] = true;

        if (support) {
            yesVotes += weight;
        } else {
            noVotes += weight;
        }

        emit VoteCast(msg.sender, support, weight);
    }

    /* Governance logic */

    function quorumReached() public view returns (bool) {
        uint256 votesCast = yesVotes + noVotes;
        return votesCast * 10_000 >= totalVotingPower * quorumBps;
    }

    function result()
        external
        view
        inPhase(Phase.Ended)
        returns (string memory)
    {
        if (!quorumReached()) {
            return "FAILED_QUORUM";
        }

        if (yesVotes > noVotes) {
            return "APPROVED";
        } else {
            return "REJECTED";
        }
    }

    /* View helpers */

    function getVoteCounts() external view returns (uint256, uint256) {
        return (yesVotes, noVotes);
    }

    function getPhase() external view returns (Phase) {
        return phase;
    }

    function getUserVotingPower(address voter) external view returns (uint256) {
        return stake[voter];
    }
}
