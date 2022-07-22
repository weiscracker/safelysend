import React from 'react';
import { Box, Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export const CodeTab = props => {
  return (
    <Box>
      <Link
        href="https://rinkeby.etherscan.io/address/0x3473899ad838368538c4cce66b24d557817174bb"
        isExternal
      >
        Check out the contract on Etherscan <ExternalLinkIcon mx="2px" />
      </Link>
    </Box>
  );
};
