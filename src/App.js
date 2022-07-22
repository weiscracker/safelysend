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

import con from './SafelySend.json';
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
      contractAddr: '0x3473899AD838368538c4cce66b24d557817174bB',
      abi: con.abi,
      contract: '',
      web3: '',
    };
  }

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
              <Text>SafelySend</Text>
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
                  <SendTab state={this.state} />
                </TabPanel>
                <TabPanel>
                  <ReceiveTab state={this.state} />
                </TabPanel>
                <TabPanel>
                  <AbortTab state={this.state} />
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
