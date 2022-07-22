import React from 'react';
import { Box, Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export const CodeTab = props => {
  return (
    <Box>
      <Link
        href={
          'https://rinkeby.etherscan.io/address/0x82Cbb5a8E41EA6ad0D24C288bd70648EC42E30dF'
        }
        isExternal
      >
        Check out the contract on Etherscan <ExternalLinkIcon mx="2px" />
      </Link>
    </Box>
  );
};
