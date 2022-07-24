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
import { AboutTab } from './AboutTab';
import { CodeTab } from './CodeTab';

import conEth from './SafelySend.json';
import conOpt from './SafelySendOptimism.json';
import Web3 from 'web3';

export const ConnectWalletBtn = props => {
  async function loadWeb3(props) {
    if (window.ethereum) {
      // Request account access if needed
      var accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      var web3a = new Web3(Web3.givenProvider);
      var isEth = true;
      var isDeployed = true;
      const n = await web3a.eth.net.getId();
      if (!conEth.networks[n]) {
        isEth = false;
        if (!conOpt.networks[n]) {
          isDeployed = false;
          window.alert(
            'Contract only deployed on Ethereum Mainnet, Optimism Mainnet, Ethereum Rinkeby, and Optimism Goerli.'
          );
        }
      }
      if (isDeployed) {
        var _abi;
        var _contrAddr;
        if (isEth) {
          _abi = conEth.abi;
          _contrAddr = conEth.networks[n]['address'];
        } else {
          _abi = conOpt.abi;
          _contrAddr = conOpt.networks[n]['address'];
        }
        const acct = accounts[0];
        const tempState = {
          network: n,
          account: acct,
          accountShort:
            acct.substring(0, 5) +
            '...' +
            acct.substring(acct.length - 4, acct.length),
          abi: _abi,
          contractAddress: _contrAddr,
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
      contractAddr: '',
      abi: '',
      contract: '',
      web3: '',
    };
  }

  updateStateFromConnectWalletButton = newState => {
    var web3a = new Web3(Web3.givenProvider);

    var c = new web3a.eth.Contract(newState.abi, newState.contractAddress);
    this.setState({
      network: newState.n,
      contractAddr: newState.contractAddress,
      account: newState.account,
      accountShort: newState.accountShort,
      contract: c,
      abi: newState.abi,
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
                <Tab>About</Tab>
                <Tab>Send</Tab>
                <Tab>Receive</Tab>
                <Tab>Abort</Tab>
                <Tab>Contract</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <AboutTab />
                </TabPanel>
                <TabPanel>
                  <SendTab state={this.state} />
                </TabPanel>
                <TabPanel>
                  <ReceiveTab state={this.state} />
                </TabPanel>
                <TabPanel>
                  <AbortTab state={this.state} />
                </TabPanel>
                <TabPanel>
                  <CodeTab state={this.state} />
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
