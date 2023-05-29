module.exports = (artifacts: Truffle.Artifacts) => {
	return async (deployer: Truffle.Deployer, network: string, accounts: string[]) => {
		deployer.deploy(artifacts.require("Lotterex"))
	}
}
