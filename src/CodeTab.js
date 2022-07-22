import React from 'react';
import { Box, Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export const CodeTab = props => {
  return (
    <Box>
      <Link
        href={
          'https://etherscan.io/address/0xb6c34f340B11daa5107972105B2DF2Fe5d1ED4B3#code'
        }
        isExternal
      >
        Check out the contract on Etherscan <ExternalLinkIcon mx="2px" />
      </Link>
    </Box>
  );
};
