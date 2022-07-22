import React from 'react';
import { useState } from 'react';
import { Button, Text, Box, Spinner } from '@chakra-ui/react';

export const ReceiveTab = props => {
  const [validTransactions, setValidTransactions] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingId, setProcessingId] = useState(-1);

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
              sentTime: result[1],
              from: result[2],
              to: result[3],
              amount: result[4],
              unlockTime: result[5],
            };
            addToValidTransactions(thisTrans);
          }
        });
    }
    setButtonClicked(true);
  }

  async function withdrawTransaction(aId) {
    setProcessing(true);
    setProcessingId(aId);
    await props.state.contract.methods
      .withdrawTransaction(aId)
      .send({ from: props.state.account });
    await getValidTransactions();
    setProcessing(false);
  }

  function withdrawTransactionButton(aTrans) {
    if (aTrans.unlockTime * 1000 < Date.now()) {
      if (!(processing && processingId === aTrans.id)) {
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
        return <Spinner></Spinner>;
      }
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
            <Text>
              {'Sent: ' + new Date(trans.sentTime * 1000).toLocaleString()}
            </Text>
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
      if (buttonClicked) {
        return <Text>No Transactions Found</Text>;
      } else {
        return false;
      }
    }
  }
  return (
    <div>
      <Button
        onClick={() => {
          getValidTransactions();
        }}
      >
        Check Transactions For You
      </Button>
      {transactionList()}
    </div>
  );
};
