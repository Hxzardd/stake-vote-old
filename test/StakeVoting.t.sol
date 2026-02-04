// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "StakeVoting.sol";

contract StakeVotingTest is Test {
    StakeVoting public voting;
    address[] public voters;
    uint256[] public powers;
    string constant PROPOSAL = "Should we allocate 100 ETH to grants?";
    uint256 constant DURATION = 100;
    uint256 constant QUORUM = 40;

    address alice = address(0xa);
    address bob = address(0xb);
    address carol = address(0xc);

    event VoteCast(address indexed voter, bool support, uint256 votingPower);

    function setUp() public {
        voters = [alice, bob, carol];
        powers = [100, 50, 50]; // total 200, quorum 40% = 80
        voting = new StakeVoting(PROPOSAL, voters, powers, DURATION, QUORUM);
    }

    // ---------- Constructor ----------
    function test_Constructor_SetsState() public view {
        assertEq(voting.getProposal(), PROPOSAL);
        assertEq(voting.getProposalDeadline(), block.number + DURATION);
        assertEq(voting.getQuorumPercentage(), QUORUM);
        assertEq(voting.getTotalVotingPower(), 200);
        assertEq(voting.getUserVotingPower(alice), 100);
        assertEq(voting.getUserVotingPower(bob), 50);
        assertEq(voting.getUserVotingPower(carol), 50);
        (uint256 y, uint256 n) = voting.getVoteCounts();
        assertEq(y, 0);
        assertEq(n, 0);
        assertFalse(voting.hasUserVoted(alice));
    }

    function test_Constructor_RevertsEmptyVoters() public {
        address[] memory v;
        uint256[] memory p;
        vm.expectRevert("StakeVoting: no voters");
        new StakeVoting(PROPOSAL, v, p, DURATION, QUORUM);
    }

    function test_Constructor_RevertsLengthMismatch() public {
        uint256[] memory p = new uint256[](1);
        p[0] = 100;
        vm.expectRevert("StakeVoting: length mismatch");
        new StakeVoting(PROPOSAL, voters, p, DURATION, QUORUM);
    }

    function test_Constructor_RevertsQuorumOver100() public {
        vm.expectRevert("StakeVoting: quorum > 100");
        new StakeVoting(PROPOSAL, voters, powers, DURATION, 101);
    }

    function test_Constructor_RevertsZeroPower() public {
        address[] memory v = new address[](1);
        v[0] = alice;
        uint256[] memory p = new uint256[](1);
        p[0] = 0;
        vm.expectRevert("StakeVoting: zero power");
        new StakeVoting(PROPOSAL, v, p, DURATION, QUORUM);
    }

    function test_Constructor_RevertsZeroAddress() public {
        address[] memory v = new address[](1);
        v[0] = address(0);
        uint256[] memory p = new uint256[](1);
        p[0] = 100;
        vm.expectRevert("StakeVoting: zero address");
        new StakeVoting(PROPOSAL, v, p, DURATION, QUORUM);
    }

    function test_Constructor_RevertsDuplicateVoter() public {
        address[] memory v = new address[](2);
        v[0] = alice;
        v[1] = alice;
        uint256[] memory p = new uint256[](2);
        p[0] = 50;
        p[1] = 50;
        vm.expectRevert("StakeVoting: duplicate voter");
        new StakeVoting(PROPOSAL, v, p, DURATION, QUORUM);
    }

    function test_Constructor_RevertsZeroDuration() public {
        vm.expectRevert("StakeVoting: zero duration");
        new StakeVoting(PROPOSAL, voters, powers, 0, QUORUM);
    }

    function test_Constructor_RevertsEmptyDescription() public {
        vm.expectRevert("StakeVoting: empty description");
        new StakeVoting("", voters, powers, DURATION, QUORUM);
    }

    // ---------- vote() ----------
    function test_Vote_SingleYes_UpdatesState() public {
        vm.prank(alice);
        vm.expectEmit(true, true, true, true);
        emit VoteCast(alice, true, 100);
        voting.vote(true);

        assertTrue(voting.hasUserVoted(alice));
        (uint256 y, uint256 n) = voting.getVoteCounts();
        assertEq(y, 100);
        assertEq(n, 0);
    }

    function test_Vote_SingleNo_UpdatesState() public {
        vm.prank(alice);
        voting.vote(false);
        assertTrue(voting.hasUserVoted(alice));
        (uint256 y, uint256 n) = voting.getVoteCounts();
        assertEq(y, 0);
        assertEq(n, 100);
    }

    function test_Vote_Multiple_AccumulatesWeights() public {
        vm.prank(alice);
        voting.vote(true);
        vm.prank(bob);
        voting.vote(false);
        vm.prank(carol);
        voting.vote(true);

        (uint256 y, uint256 n) = voting.getVoteCounts();
        assertEq(y, 150); // 100 + 50
        assertEq(n, 50);
    }

    function test_Vote_RevertsNoPower() public {
        vm.prank(address(0x999));
        vm.expectRevert("StakeVoting: no voting power");
        voting.vote(true);
    }

    function test_Vote_RevertsAlreadyVoted() public {
        vm.startPrank(alice);
        voting.vote(true);
        vm.expectRevert("StakeVoting: already voted");
        voting.vote(false);
        vm.stopPrank();
    }

    function test_Vote_RevertsAfterDeadline() public {
        vm.roll(block.number + DURATION + 1);
        vm.prank(alice);
        vm.expectRevert("StakeVoting: voting ended");
        voting.vote(true);
    }

    function test_Vote_LastBlockBeforeDeadline_Succeeds() public {
        vm.roll(block.number + DURATION - 1);
        vm.prank(alice);
        voting.vote(true);
        (uint256 y,) = voting.getVoteCounts();
        assertEq(y, 100);
    }

    // ---------- getProposalStatus ----------
    function test_Status_Active_BeforeDeadline() public view {
        assertEq(voting.getProposalStatus(), "Active");
    }

    function test_Status_Expired_AfterDeadlineNoVotes() public {
        vm.roll(block.number + DURATION + 1);
        assertEq(voting.getProposalStatus(), "Rejected"); // no quorum
    }

    function test_Status_Passed_YesMeetsQuorum() public {
        vm.prank(alice);
        voting.vote(true); // 100/200 = 50% >= 40%
        vm.roll(block.number + DURATION + 1);
        assertEq(voting.getProposalStatus(), "Passed");
    }

    function test_Status_Rejected_YesBelowQuorum() public {
        vm.prank(bob);
        voting.vote(true); // 50/200 = 25% < 40%
        vm.roll(block.number + DURATION + 1);
        assertEq(voting.getProposalStatus(), "Rejected");
    }

    function test_Status_Rejected_NoMajority() public {
        vm.prank(alice);
        voting.vote(false);
        vm.prank(bob);
        voting.vote(false);
        vm.roll(block.number + DURATION + 1);
        assertEq(voting.getProposalStatus(), "Rejected");
    }

    // ---------- Edge cases ----------
    function test_Edge_SingleVoter_CanVoteAndPass() public {
        address[] memory v = new address[](1);
        v[0] = alice;
        uint256[] memory p = new uint256[](1);
        p[0] = 100;
        StakeVoting single = new StakeVoting("Solo?", v, p, DURATION, 100); // 100% quorum
        vm.prank(alice);
        single.vote(true);
        vm.roll(block.number + DURATION + 1);
        assertEq(single.getProposalStatus(), "Passed");
    }

    function test_Edge_ZeroQuorum_AfterDeadlinePassesWithAnyYes() public {
        StakeVoting noQuorum = new StakeVoting(PROPOSAL, voters, powers, DURATION, 0);
        vm.prank(carol);
        noQuorum.vote(true); // 50/200
        vm.roll(block.number + DURATION + 1);
        assertEq(noQuorum.getProposalStatus(), "Passed");
    }

    function test_Edge_UserNotInSnapshot_HasZeroPower() public view {
        assertEq(voting.getUserVotingPower(address(0x1)), 0);
        assertFalse(voting.hasUserVoted(address(0x1)));
    }
}
