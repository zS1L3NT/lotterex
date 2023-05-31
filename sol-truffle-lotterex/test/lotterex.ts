const Lotterex = artifacts.require("Lotterex")

contract("Lotterex", accounts => {
	it("should set the manager of the smart contract to the deployer", async () => {
		const lotterex = await Lotterex.deployed()
		const manager = await lotterex.manager()

		assert.equal(manager, accounts[0])
	})

	it("should set the name of the smart contract to 'testing'", async () => {
		const lotterex = await Lotterex.deployed()
		const name = await lotterex.name()

		assert.equal(name, "testing")
	})

	it("should allow the manager to view the balance", async () => {
		const lotterex = await Lotterex.deployed()
		const balance = await lotterex.getBalance()

		assert(balance.eq(web3.utils.toBN(0)))
	})

	it("should not allow a non-manager to view the balance", async () => {
		const lotterex = await Lotterex.deployed()

		try {
			await lotterex.getBalance({ from: accounts[1] })
			assert(false)
		} catch (err) {
			assert(true)
		}
	})

	it("should not allow a non-manager to view the players", async () => {
		const lotterex = await Lotterex.deployed()

		try {
			await lotterex.getPlayers({ from: accounts[1] })
			assert(false)
		} catch (err) {
			assert(true)
		}
	})

	it("should allow any player to enter the lottery", async () => {
		const lotterex = await Lotterex.deployed()

		await lotterex.send(web3.utils.toWei("0.1", "ether"), { from: accounts[1] })

		const player = (await lotterex.getPlayers())[0]

		assert.equal(player, accounts[1])
		assert.equal((await lotterex.getBalance()).toString(), web3.utils.toWei("0.1", "ether"))
	})

	it("should show that the player has entered the lottery", async () => {
		const lotterex = await Lotterex.deployed()

		assert(await lotterex.hasEntered({ from: accounts[1] }))
	})

	it("shouldn't allow a player to enter the lottery twice", async () => {
		const lotterex = await Lotterex.deployed()

		try {
			await lotterex.send(web3.utils.toWei("0.1", "ether"), { from: accounts[1] })
			assert(false)
		} catch (err) {
			assert(true)
		}
	})

	it("should require a minimum of 0.1 ETH to enter", async () => {
		const lotterex = await Lotterex.deployed()

		try {
			await lotterex.send(web3.utils.toWei("0.05", "ether"), { from: accounts[1] })
			assert(false)
		} catch (err) {
			assert(true)
		}
	})

	it("should allow players to leave the lottery", async () => {
		const lotterex = await Lotterex.deployed()
		const before = web3.utils.toBN(await web3.eth.getBalance(accounts[1]!))

		await lotterex.leave({ from: accounts[1] })

		const after = web3.utils.toBN(await web3.eth.getBalance(accounts[1]!))
		const difference = after.sub(before)

		assert(difference.gt(web3.utils.toBN(web3.utils.toWei("0.09", "ether"))))
		assert(difference.lt(web3.utils.toBN(web3.utils.toWei("0.1", "ether"))))
		assert(!(await lotterex.hasEntered({ from: accounts[1] })))
		assert.equal((await lotterex.getBalance()).toString(), web3.utils.toWei("0", "ether"))
	})

	it("should return any excess ETH to the sender", async () => {
		const lotterex = await Lotterex.deployed()
		const before = web3.utils.toBN(await web3.eth.getBalance(accounts[1]!))

		await lotterex.send(web3.utils.toWei("0.2", "ether"), { from: accounts[1] })

		const after = web3.utils.toBN(await web3.eth.getBalance(accounts[1]!))
		const difference = before.sub(after)

		assert(difference.gt(web3.utils.toBN(web3.utils.toWei("0.1", "ether"))))
		assert(difference.lt(web3.utils.toBN(web3.utils.toWei("0.101", "ether"))))
		assert.equal((await lotterex.getBalance()).toString(), web3.utils.toWei("0.1", "ether"))
	})

	it("should allow multiple users to join", async () => {
		const lotterex = await Lotterex.deployed()

		assert.equal((await lotterex.getPlayers())[0], accounts[1])

		await lotterex.send(web3.utils.toWei("0.1", "ether"), { from: accounts[2] })

		assert.equal((await lotterex.getPlayers())[1], accounts[2])
	})

	it("shouldn't allow a non-manager to pick a winner", async () => {
		const lotterex = await Lotterex.deployed()

		try {
			await lotterex.pickWinner({ from: accounts[1] })
			assert(false)
		} catch (err) {
			assert(true)
		}
	})

	it("should require at least 3 players to pick a winner", async () => {
		const lotterex = await Lotterex.deployed()

		try {
			await lotterex.pickWinner()
			assert(false)
		} catch (err) {
			assert(true)
		}
	})

	it("should send the winner all the ETH in the contract", async () => {
		const lotterex = await Lotterex.deployed()

		await lotterex.send(web3.utils.toWei("0.1", "ether"), { from: accounts[3] })

		assert.equal((await lotterex.getPlayers())[2], accounts[3])
		assert.equal((await lotterex.getBalance()).toString(), web3.utils.toWei("0.3", "ether"))

		const before = web3.utils
			.toBN(await web3.eth.getBalance(accounts[1]!))
			.add(web3.utils.toBN(await web3.eth.getBalance(accounts[2]!)))
			.add(web3.utils.toBN(await web3.eth.getBalance(accounts[3]!)))

		await lotterex.pickWinner()

		const after = web3.utils
			.toBN(await web3.eth.getBalance(accounts[1]!))
			.add(web3.utils.toBN(await web3.eth.getBalance(accounts[2]!)))
			.add(web3.utils.toBN(await web3.eth.getBalance(accounts[3]!)))

		const difference = after.sub(before)

		assert(difference.eq(web3.utils.toBN(web3.utils.toWei("0.3", "ether"))))
		assert.equal((await lotterex.getBalance()).toString(), web3.utils.toWei("0", "ether"))
	})
})
