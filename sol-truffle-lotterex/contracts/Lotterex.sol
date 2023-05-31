// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Lotterex {
	string public name;
	address public manager;
	address[] private players;

	constructor(string memory _name) {
		name = _name;
		manager = msg.sender;
	}

	modifier onlyManager {
		require(msg.sender == manager, "Only the manager can call this function");
		_;
	}

	function getPlayers() onlyManager external view returns (address[] memory) {
		return players;
	}

	function getBalance() onlyManager external view returns (uint256) {
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

	receive() external payable {
		require(!hasEntered(), "You have already entered");
		require(msg.value >= 0.1 ether, "You must send 0.1 ether to enter");

		if (msg.value > 0.1 ether) {
			payable(msg.sender).transfer(msg.value - 0.1 ether);
		}

		players.push(msg.sender);
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

	function pickWinner() onlyManager external returns (address) {
		require(players.length >= 3, "There are not enough players to pick a winner");

		address payable winner = payable(players[random() % players.length]);

		winner.transfer(address(this).balance);
		players = new address[](0);

		return winner;
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
