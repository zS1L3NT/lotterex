// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Lotterex {
	address public manager;
	address[] public players;

	constructor() {
		manager = msg.sender;
	}

	receive() external payable {
		require(!hasEntered(), "You have already entered");
		require(msg.value >= 0.1 ether, "You must send 0.1 ether to enter");

		if (msg.value > 0.1 ether) {
			payable(msg.sender).transfer(msg.value - 0.1 ether);
		}

		players.push(msg.sender);
	}

	function getPlayers() external view returns (address[] memory) {
		require(msg.sender == manager, "Only the manager can call this function");

		return players;
	}

	function getBalance() external view returns (uint256) {
		require(msg.sender == manager, "Only the manager can call this function");

		return address(this).balance;
	}

	function hasEntered() public view returns (bool) {
		for (uint256 i = 0; i < players.length; i++) {
			if (players[i] == msg.sender) {
				return true;
			}
		}

		return false;
	}

	function leave() external {
		require(hasEntered(), "You have not entered the lottery");
		
		for (uint256 i = 0; i < players.length; i++) {
			if (players[i] == msg.sender) {
				// The only way to delete an element from an array, changing it's length
				players[i] = players[players.length - 1];
				players.pop();
				payable(msg.sender).transfer(0.1 ether);
			}
		}
	}

	function pickWinner() external {
		require(msg.sender == manager, "Only the manager can call this function");
		require(players.length >= 3, "There are not enough players to pick a winner");

		address payable winner = payable(players[random() % players.length]);

		winner.transfer(address(this).balance);
		players = new address[](0);
	}

	function random() private view returns (uint256) {
		// Convert product to a uint256
		return uint256(
			// Hash the encoded data
			keccak256(
				// Encode some data that could provide randomness
				abi.encodePacked(
					block.prevrandao,
					block.timestamp,
					players.length
				)
			)
		);
	}
}
