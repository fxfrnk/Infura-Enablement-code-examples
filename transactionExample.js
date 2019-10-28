//To learn more information on the Web3.js library, please see https://web3js.readthedocs.io

//First we will include the web3.js library in our dapp with the declaration below
var Web3 = require('web3')

//Copy the project id from one of your projects in your Infura Dashboard
//add your project id to the url below. This is your infura endpoint
var provider = 'https://rinkeby.infura.io/INFURA_PROJECT_ID'

//set the provider for your dapp
var web3 = new Web3(provider)

//assign the receiving address to a variable 
//you can use an address from your MetaMask wallet
var receiver =  'Recipient_Ethereum_Address'

//replace the placeholder string below with your own private key
//you will create an account object from this private key
var senderAccount = web3.eth.accounts.privateKeyToAccount('Your_Private_Key')

//Our first function that will assemble our transaction into a transaction object called txObject
async function createTransaction(receivingAddress, account){
    
    try{
        let txCount = await web3.eth.getTransactionCount(account.address)
        let txObject = {
            to: receivingAddress,       //recipient of the transaction
            value: '1000000000',        //amount of ETH in wei
            gas: 21000,                 //gas limit in gwei
            gasPrice: '1000000000',     //gas price in wei
            nonce: txCount,             //nonce of the account that is sending the transaction which was retrieved using web3.eth.getTransactionCount
            chainId: 4                  //chain ID of the network (rinkeby in this case)
        }

        return txObject
    }
    catch(error){
        console.log(error) //will display an error message in the console if one occurs
    }

}

//The function below will sign our txObject with the private key of our account
async function signTransaction(txObject, account){
    try{
        let signedTxObject = await web3.eth.accounts.signTransaction(txObject, account.privateKey)
        return signedTxObject.rawTransaction
    }
    catch(error){
        console.log(error) 
    }
}

//The function below will send our signed transaction and will provide the txn hash 
async function sendTransaction(signedTransaction){
    try{
        let receipt = await web3.eth.sendSignedTransaction(signedTransaction).then(function(result){
            return result.transactionHash
        })

        return receipt
    }
    catch(error){
        console.log(error)
    }
}

/* Executing our functions in order:
1. createTransaction
2. signTransaction
3. sendTransaction

After sending the transaction, it will display the transaction hash in the console */

createTransaction(receiver, senderAccount).then(function(result){
    signTransaction(result,senderAccount).then(function(result){
        sendTransaction(result).then(function(result){
            console.log('Transaction Hash: ' + result)
        })
    })
})
