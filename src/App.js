import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Grid,
  theme,
  Button,
  Flex,
} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { SendTab } from './SendTab';
import { ReceiveTab } from './ReceiveTab';
import { AbortTab } from './AbortTab';

import con from './SafeSend.json';
import Web3 from 'web3';

export const ConnectWalletBtn = props => {
  async function loadWeb3(props) {
    if (window.ethereum) {
      // Request account access if needed
      var accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      var web3a = new Web3(Web3.givenProvider);
      const network = await web3a.eth.net.getId();
      if (network !== 4) {
        window.alert('THIS CONTRACT IS ONLY VALID ON RINKEBY!');
      } else {
        const acct = accounts[0];
        const tempState = {
          account: acct,
          accountShort:
            acct.substring(0, 5) +
            '...' +
            acct.substring(acct.length - 4, acct.length),
        };
        props.updateStateCallback(tempState);
      }
    }
    return;
  }

  return (
    <Button
      onClick={() => {
        loadWeb3(props);
      }}
    >
      {props.connectWalletText}
    </Button>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      accountShort: '',
      contractAddr: '0xA8578CB6b29C489B514184Ba31c557D91037a1b7',
      abi: con.abi,
      sender: '',
      receiver: '',
      amount: 0,
      time: 1,
      units: 3600,
      contract: '',
      web3: '',
      count: 0,
    };
  }

  updateSender = aSender => {
    this.setState({ sender: aSender });
  };

  updateReceiver = aRcvr => {
    this.setState({ receiver: aRcvr });
  };

  updateAmount = aAmt => {
    this.setState({ amount: aAmt });
  };

  updateTime = aTime => {
    this.setState({ time: aTime });
  };

  updateUnits = aUnits => {
    var u = 1;
    if (aUnits === 'hour') {
      u = 60 * 60;
    }
    if (aUnits === 'day') {
      u = 60 * 60 * 24;
    }
    if (aUnits === 'sec') {
      u = 1;
    }
    this.setState({ units: u });
  };

  updateStateFromConnectWalletButton = newState => {
    var web3a = new Web3(Web3.givenProvider);

    var c = new web3a.eth.Contract(this.state.abi, this.state.contractAddr);

    this.setState({
      account: newState.account,
      accountShort: newState.accountShort,
      contract: c,
      web3: web3a,
    });
  };

  render() {
    return (
      <ChakraProvider theme={theme}>
        <Box p="1em">
          <Grid>
            <Flex w="100%" align="center" justify="space-between">
              <Text>SafeSend</Text>
              <ConnectWalletBtn
                updateStateCallback={this.updateStateFromConnectWalletButton}
                connectWalletText={
                  this.state.accountShort === ''
                    ? 'Connect Wallet'
                    : this.state.accountShort
                }
              />
            </Flex>
            <Tabs>
              <TabList>
                <Tab>Send</Tab>
                <Tab>Receive</Tab>
                <Tab>Abort</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SendTab
                    state={this.state}
                    updateRecieverCallback={this.updateReceiver}
                    updateSenderCallback={this.updateSender}
                    updateAmountCallback={this.updateAmount}
                    updateTimeCallback={this.updateTime}
                    updateUnitsCallback={this.updateUnits}
                  />
                </TabPanel>
                <TabPanel>
                  <ReceiveTab
                    state={this.state}
                    forceUpdateCallback={this.forceUpdateFunc}
                  />
                </TabPanel>
                <TabPanel>
                  <AbortTab />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Grid>
        </Box>
      </ChakraProvider>
    );
  }
}

export default App;
