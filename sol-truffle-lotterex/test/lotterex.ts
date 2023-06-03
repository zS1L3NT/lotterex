const Lotterex = artifacts.require("Lotterex")

const ether = (ether: number | string) => web3.utils.toBN(web3.utils.toWei(ether + "", "ether"))
const balance = async (address: string) => web3.utils.toBN(await web3.eth.getBalance(address))
const error = (e: any, message: string) => (e as Error).message.includes(message)

contract("Lotterex", accounts => {
	it("should set the open status of the smart contract to true", async () => {
		const lotterex = await Lotterex.deployed()
		const open = await lotterex.open()

		assert(open)
	})

	it("should set the name of the smart contract to 'testing'", async () => {
		const lotterex = await Lotterex.deployed()
		const name = await lotterex.name()

		assert.equal(name, "testing")
	})

	it("should set the manager of the smart contract to the deployer", async () => {
		const lotterex = await Lotterex.deployed()
		const manager = await lotterex.manager()

		assert.equal(manager, accounts[0])
	})

	it("should set the price of the smart contract to 0.1 ETH", async () => {
		const lotterex = await Lotterex.deployed()
		const price = await lotterex.price()

		assert(price.eq(ether(0.1)))
	})

	it("should allow the manager to view the balance", async () => {
		const lotterex = await Lotterex.deployed()
		const balance = await lotterex.getBalance()

		assert(balance.eq(ether(0)))
	})

	it("should not allow a non-manager to view the balance", async () => {
		const lotterex = await Lotterex.deployed()

		try {
			await lotterex.getBalance({ from: accounts[1] })
			assert(false)
		} catch (e) {
			error(e, "Only the manager can call this function")
		}
	})

	it("should not allow a non-manager to view the players", async () => {
		const lotterex = await Lotterex.deployed()

		try {
			await lotterex.getPlayers({ from: accounts[1] })
			assert(false)
		} catch (e) {
			error(e, "Only the manager can call this function")
		}
	})

	it("should allow any player to enter the lottery", async () => {
		const lotterex = await Lotterex.deployed()

		await lotterex.send(ether(0.1), { from: accounts[1] })

		const player = (await lotterex.getPlayers())[0]

		assert.equal(player, accounts[1])
		assert(ether(0.1).eq(await lotterex.getBalance()))
	})

	it("should show that the player has entered the lottery", async () => {
		const lotterex = await Lotterex.deployed()

		assert(await lotterex.hasEntered({ from: accounts[1] }))
	})

	it("shouldn't allow a player to enter the lottery twice", async () => {
		const lotterex = await Lotterex.deployed()

		try {
			await lotterex.send(ether(0.1), { from: accounts[1] })
			assert(false)
		} catch (e) {
			error(e, "You have already entered")
		}
	})

	it("should require a minimum of 0.1 ETH to enter", async () => {
		const lotterex = await Lotterex.deployed()

		try {
			await lotterex.send(ether(0.05), { from: accounts[1] })
			assert(false)
		} catch (e) {
			error(e, "You did not send enough ether to enter")
		}
	})

	it("should allow players to leave the lottery", async () => {
		const lotterex = await Lotterex.deployed()
		const before = await balance(accounts[1]!)

		await lotterex.leave({ from: accounts[1] })

		const after = await balance(accounts[1]!) 
		const difference = after.sub(before)

		assert(difference.gt(ether(0.09)) && difference.lt(ether(0.1)))
		assert(!(await lotterex.hasEntered({ from: accounts[1] })))
		assert((await balance(lotterex.address)).eq(ether(0)))
	})

	it("shouldn't allow a player that hasn't entered to leave", async () => {
		const lotterex = await Lotterex.deployed()

		try {
			await lotterex.leave({ from: accounts[1] })
			assert(false)
		} catch (e) {
			error(e, "You have not entered the lottery")
		}
	})

	it("should return any excess ETH to the sender", async () => {
		const lotterex = await Lotterex.deployed()
		const before = await balance(accounts[1]!)

		await lotterex.send(ether(0.2), { from: accounts[1] })

		const after = await balance(accounts[1]!) 
		const difference = before.sub(after)

		assert(difference.gt(ether(0.1)) && difference.lt(ether(0.102)))
		assert((await balance(lotterex.address)).eq(ether(0.1)))
	})

	it("should allow multiple users to join", async () => {
		const lotterex = await Lotterex.deployed()

		assert.equal((await lotterex.getPlayers())[0], accounts[1])

		await lotterex.send(ether(0.1), { from: accounts[2] })

		assert.equal((await lotterex.getPlayers())[1], accounts[2])
	})

	it("shouldn't allow a non-manager to pick a winner", async () => {
		const lotterex = await Lotterex.deployed()

		try {
			await lotterex.pickWinner({ from: accounts[1] })
			assert(false)
		} catch (e) {
			error(e, "Only the manager can call this function")
		}
	})

	it("should require at least 3 players to pick a winner", async () => {
		const lotterex = await Lotterex.deployed()

		try {
			await lotterex.pickWinner()
			assert(false)
		} catch (e) {
			error(e, "There are not enough players to pick a winner")
		}
	})

	it("should send the winner all the ETH in the contract", async () => {
		const lotterex = await Lotterex.deployed()

		await lotterex.send(ether(0.1), { from: accounts[3] })

		assert.equal((await lotterex.getPlayers())[2], accounts[3])
		assert(ether(0.3).eq(await balance(lotterex.address)))

		const before = (await balance(accounts[1]!)).add(await balance(accounts[2]!)).add(await balance(accounts[3]!))

		await lotterex.pickWinner()

		const after = (await balance(accounts[1]!)).add(await balance(accounts[2]!)).add(await balance(accounts[3]!))
		const difference = after.sub(before)

		assert(difference.eq(ether(0.3)))
		assert(ether(0).eq(await balance(lotterex.address)))
	})

	it("should return all ETH to players when closing the lottery", async () => {
		const lotterex = await Lotterex.deployed()

		await lotterex.send(ether(0.1), { from: accounts[1] })

		assert.equal((await lotterex.getPlayers())[0], accounts[1])
		assert(ether(0.1).eq(await balance(lotterex.address)))

		const before = await balance(accounts[1]!)

		await lotterex.close()

		const after = await balance(accounts[1]!)
		const difference = after.sub(before)

		assert(difference.eq(ether(0.1)))
		assert(ether(0).eq(await balance(lotterex.address)))
	})

	it("shouldn't allow a non-manager to close the lottery", async () => {
		const lotterex = await Lotterex.deployed()

		try {
			await lotterex.close({ from: accounts[1] })
			assert(false)
		} catch (e) {
			error(e, "Only the manager can call this function")
		}
	})

	it("shouldn't allow the anyone to interact with the lottery after closing", async () => {
		const lotterex = await Lotterex.deployed()

		try {
			await lotterex.getPlayers()
			assert(false)
		} catch (e) {
			error(e, "The lottery is closed")
		}

		try {
			await lotterex.getBalance()
			assert(false)
		} catch (e) {
			error(e, "The lottery is closed")
		}

		try {
			await lotterex.hasEntered()
			assert(false)
		} catch (e) {
			error(e, "The lottery is closed")
		}

		try {
			await lotterex.send(ether(0.1), { from: accounts[1] })
			assert(false)
		} catch (e) {
			error(e, "The lottery is closed")
		}

		try {
			await lotterex.leave()
			assert(false)
		} catch (e) {
			error(e, "The lottery is closed")
		}

		try {
			await lotterex.pickWinner()
			assert(false)
		} catch (e) {
			error(e, "The lottery is closed")
		}

		try {
			await lotterex.close()
			assert(false)
		} catch (e) {
			error(e, "The lottery is closed")
		}
	})
})
