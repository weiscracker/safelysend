import React from 'react';
import { useState } from 'react';
import { Button, Text, Box } from '@chakra-ui/react';

export const ReceiveTab = props => {
  const [validTransactions, setValidTransactions] = useState([]);

  function addToValidTransactions(trans) {
    if (validTransactions) {
      setValidTransactions(prevList => [...prevList, trans]);
    }
  }
  function resetValidTransactions() {
    setValidTransactions([]);
  }

  async function getValidTransactions() {
    resetValidTransactions();
    var ans = await props.state.contract.methods
      .checkTransactionsWaitingReceiver(props.state.account)
      .call();

    for (const x of ans) {
      props.state.contract.methods
        .transactionMap(x)
        .call()
        .then(function (result) {
          var reverted = result[5];
          var completed = result[6];
          if (!reverted && !completed) {
            var thisTrans = {
              id: result[0],
              from: result[1],
              to: result[2],
              amount: result[3],
              unlockTime: result[4],
            };
            addToValidTransactions(thisTrans);
          }
        });
    }
  }

  async function withdrawTransaction(aId) {
    await props.state.contract.methods
      .withdrawTransaction(aId)
      .send({ from: props.state.account });
  }

  function withdrawTransactionButton(aTrans) {
    if (aTrans.unlockTime * 1000 < Date.now()) {
      return (
        <Button
          m={2}
          onClick={() => {
            withdrawTransaction(aTrans.id);
          }}
        >
          Withdraw Transaction
        </Button>
      );
    } else {
      return (
        <Text>
          {'Time Available: ' +
            new Date(aTrans.unlockTime * 1000).toLocaleString()}
        </Text>
      );
    }
  }

  function transactionList() {
    if (validTransactions[0]) {
      return validTransactions.map(trans => {
        return (
          <Box p={4} m={1} border="1px" key={'Transaction:' + trans.id}>
            <Text>{'Id: ' + trans.id}</Text>
            <Text>{'From: ' + trans.from}</Text>
            <Text>
              {'Amount: ' +
                props.state.web3.utils.fromWei(trans.amount) +
                ' ether'}
            </Text>
            {withdrawTransactionButton(trans)}
          </Box>
        );
      });
    } else {
      return false;
    }
  }
  return (
    <div>
      <Button
        onClick={() => {
          getValidTransactions();
        }}
      >
        Check Pending Transactions
      </Button>
      {transactionList()}
    </div>
  );
};
