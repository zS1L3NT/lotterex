// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract Lotterex {
	bool public open;
	string public name;
	address public manager;
	uint256 public price;
	address[] private players;

	constructor(string memory _name, uint256 _price) {
		require(bytes(_name).length > 0, "The name must not be empty");
		require(_price > 0.00001 ether, "The price must be greater than 0.00001 ether");
		
		open = true;
		name = _name;
		price = _price;
		manager = msg.sender;
	}

	modifier isOpen {
		require(open, "The lottery is closed");
		_;
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

	receive() isOpen external payable {
		require(!hasEntered(), "You have already entered");
		require(msg.value >= price, "You did not send enough ether to enter");

		if (msg.value > price) {
			payable(msg.sender).transfer(msg.value - price);
		}

		players.push(msg.sender);
	}

	function leave() isOpen external {
		require(hasEntered(), "You have not entered the lottery");
		
		for (uint256 i = 0; i < players.length; i++) {
			if (players[i] == msg.sender) {
				// The only way to delete an element from an array, changing it's length
				players[i] = players[players.length - 1];
				players.pop();
				payable(msg.sender).transfer(price);
			}
		}
	}

	function pickWinner() isOpen onlyManager external {
		require(players.length >= 3, "There are not enough players to pick a winner");

		address payable winner = payable(players[random() % players.length]);

		winner.transfer(address(this).balance);
		players = new address[](0);
	}

	function close() isOpen onlyManager external {
		for (uint256 i = 0; i < players.length; i++) {
			payable(players[i]).transfer(price);
		}

		players = new address[](0);
		open = false;
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
