import React from 'react';
import { Box, Text } from '@chakra-ui/react';
export const AboutTab = props => {
  return (
    <Box>
      <Text>Welcome to SafelySend!</Text>
      <br></br>
      <Text>
        SafelySend slows down the process of transferring eth. Use the Send tab
        to send eth to any wallet while providing the other party time to hop on
        SafelySend, go to the Withdraw tab, and verify that the transaction was
        sent correctly. During this delay time, the eth is safe and no one can
        withdraw it. If the transaction was sent to the wrong address, or it was
        the wrong amount, just head to the Abort tab and revert the transaction.
      </Text>
      <br></br>
      <Text>
        Additionally, you have the option to send a tip to the contract while
        sending a transaction (minimal extra gas), which will support future
        feature upgrades including UI improvements, email notifications, ens
        lookup, ERC20 capability, gas improvements, and more. Every little bit
        counts, and this method makes sending even 0.001 eth feasible from a gas
        perspective.
      </Text>
      <br></br>
      <Text>-weiscracker</Text>
    </Box>
  );
};
