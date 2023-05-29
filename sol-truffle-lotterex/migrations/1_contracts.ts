module.exports = (deployer: Truffle.Deployer) => {
	deployer.deploy(artifacts.require("Lotterex"))
}
