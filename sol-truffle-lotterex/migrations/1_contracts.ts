module.exports = (deployer: Truffle.Deployer) => {
	deployer.deploy(artifacts.require("Lotterex"), "testing", web3.utils.toWei("0.1", "ether"))
}
