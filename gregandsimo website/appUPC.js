/*======================================================================================================================================
                                                            SMART PLUG - Dapp-Ethereum side (front-end)

                                          Copyright © Grzegorz Bytniewski and Simone Accornero, 2017
======================================================================================================================================*/

//variables definition
var accounts;
var account;
//data of the contract
var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"standard","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"decimalUnits","type":"uint8"},{"name":"tokenSymbol","type":"string"}],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];
var contractAddress = "0x5c62b492ae99db9c2a174f3328ddd2f98773291a"


/* gives the updates/messages on the main screen */
function setStatus(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
};

/* refresh balance on the main screen */
function refreshBalance() {
    var UPCoinInst = web3.eth.contract(abi);
    var UPCoin = UPCoinInst.at(contractAddress);

    UPCoin.getBalance.call(account, {
        from: account
    }, function(error, value) {
      if (!error){
        var balance_element = document.getElementById("balance");
        balance_element.innerHTML = value.valueOf();
      }
    })
};

/* function that performes transfer of tokens */
function transfer() {
    var UPCoinInst = web3.eth.contract(abi);
    var UPCoin = UPCoinInst.at(contractAddress);

    var amount = parseInt(document.getElementById("ex6").value);
    var receiver = document.getElementById("r1").value;

    setStatus("Initiating transaction... (please wait)");

    UPCoin.transfer(receiver, amount, {
        from: account
    }, function(error, result) {
      if (!error) {
        setStatus("Transaction submitted and waiting to be mained...!");
        var Transfer = UPCoin.Transfer({some: "args"}, {fromBlock: "latest", toBlock: "pending"});
        Transfer.watch(function(error, result){
        setStatus("Transaction is confirmed!" + "<br> You have succesfully purchased your charging time. <br> The plug is on! ");
        console.log(result)
      });
        refreshBalance();
      } else {
        setStatus("There has been a problem with your transaction!");
      }
    })
};
/* functions that loads with the start of the website */
window.onload = function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No web3? You should consider trying MetaMask!')
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); //use local node if any
    }
	
	//variables definition
    var UPCoinInst = web3.eth.contract(abi);
    var UPCoin = UPCoinInst.at(contractAddress);
	
	//check if there are accounts 
    web3.eth.getAccounts(function(err, accs) {
        if (err != null) {
            alert("There was an error fetching your accounts.");
            return;
        }

        if (accs.length == 0) {
            alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
        }

        accounts = accs;
        account = accounts[0];
	
	//refresh balance
    var refreshBalanceInterval = setInterval(function() {
      refreshBalance();
    }, 1000); //1000=1s

    });
	
	//refresh accunts (if you switched between)
    var accountInterval = setInterval(function() {
      if (web3.eth.accounts[0] !== account) {
        account = web3.eth.accounts[0];
        refreshBalance();
      }
    }, 1000); //1000=1s
    
}