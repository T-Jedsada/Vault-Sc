var ElectusProtocol = artifacts.require("./Protocol.sol");
var DaicoToken = artifacts.require("./DaicoToken.sol");
var LockedTokens = artifacts.require("./LockedTokens.sol");
var PollFactory = artifacts.require("./PollFactory.sol");
var CrowdSale = artifacts.require("./CrowdSale.sol");
contract("Vault Test", function(accounts) {
  let protocol1Contract;
  let protocol2Contract;
  let daicoToken;
  let lockedTokens;
  let pollFactory;
  let crowdSale;
  let presentTime;
  beforeEach("setup", async () => {
    protocol1Contract = await ElectusProtocol.new(
      "0x57616e636861696e",
      "0x57414e"
    );
    await protocol1Contract.addAttributeSet(web3.utils.fromAscii("hair"), [
      web3.utils.fromAscii("black")
    ]);
    protocol2Contract = await ElectusProtocol.new(
      "0x55532026204368696e61",
      "0x5543"
    );
    await protocol2Contract.addAttributeSet(web3.utils.fromAscii("hair"), [
      web3.utils.fromAscii("black")
    ]);
    console.log("1");
    daicoToken = await DaicoToken.new(
      "Electus",
      "ELE",
      protocol1Contract.address,
      "10000"
    );
    console.log("2");
    const amount = await daicoToken.getTotalMintableSupply();
    console.log(amount);
    lockedTokens = await LockedTokens.new(daicoToken.address);
    console.log("3");
    presentTime = (await web3.eth.getBlock(await web3.eth.getBlockNumber()))
      .timestamp;
    console.log(presentTime);
    let firstKillPollStartDate = presentTime + 10000;
    console.log(firstKillPollStartDate);
    pollFactory = await PollFactory.new(
      daicoToken.address,
      accounts[6],
      "1000000000000000000",
      [
        firstKillPollStartDate.toString(),
        (firstKillPollStartDate + 864000).toString(),
        (firstKillPollStartDate + 1728000).toString(),
        (firstKillPollStartDate + 2592000).toString(),
        (firstKillPollStartDate + 3456000).toString(),
        (firstKillPollStartDate + 4320000).toString(),
        (firstKillPollStartDate + 5184000).toString(),
        (firstKillPollStartDate + 6048000).toString()
      ],
      protocol2Contract.address,
      "10",
      "10",
      "20",
      "65",
      lockedTokens.address
    );
    console.log("4");
    crowdSale = await CrowdSale.new(
      "1000000000000000000",
      "2000000000000000000",
      presentTime + 129600,
      ["1000", "2000", "2000"],
      ["1", "2", "3"],
      lockedTokens.address,
      pollFactory.address,
      protocol1Contract.address,
      daicoToken.address,
      protocol2Contract.address,
      [accounts[7]],
      ["5000"]
    );
    console.log("5");
    await daicoToken.setTreasuryAddress(pollFactory.address);
    await daicoToken.setCrowdSaleAddress(crowdSale.address);
    await lockedTokens.setCrowdSaleAddress(crowdSale.address);
    await pollFactory.setCrowdSaleAddress(crowdSale.address);
    console.log("6");
    presentTime = (await web3.eth.getBlock(await web3.eth.getBlockNumber()))
      .timestamp;
    console.log(presentTime);
    await pollFactory.createKillPolls();

    console.log("7");
    //await crowdSale.mintFoundationTokens();
    console.log("8");
  });
  it("", async () => {});
});
