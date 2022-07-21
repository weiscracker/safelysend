import React from 'react';
import {
  Input,
  Table,
  Tr,
  Th,
  Td,
  Text,
  Select,
  Button,
  Tbody,
} from '@chakra-ui/react';

export const SendTab = props => {
  async function sendTransaction() {
    props.state.contract.methods
      .sendTransaction(
        props.state.receiver,
        props.state.time * props.state.units
      )
      .send({
        from: props.state.account,
        value: props.state.web3.utils.toWei(
          props.state.amount.toString(),
          'ether'
        ),
      });
  }

  function updateReceiver(val) {
    props.updateRecieverCallback(val);
  }

  function updateAmount(val) {
    props.updateAmountCallback(val);
  }

  function updateTime(val) {
    props.updateTimeCallback(val);
  }

  function updateUnits(val) {
    props.updateUnitsCallback(val);
  }

  return (
    <Table w="100%" variant="unstyled">
      <Tbody>
        <Tr>
          <Th isNumeric={true}>
            <Text>Receiver Address:</Text>
          </Th>
          <Td>
            <Input
              type="text"
              defaultValue={'0x0000000000000000000000000000000000000000'}
              onChange={e => updateReceiver(e.target.value)}
            ></Input>
          </Td>
        </Tr>
        <Tr>
          <Th isNumeric={true}>
            <Text>Amount to Send:</Text>
          </Th>
          <Td>
            <Input
              type="text"
              defaultValue={0}
              onChange={e => updateAmount(parseFloat(e.target.value))}
            ></Input>
          </Td>
          <Td>Eth</Td>
        </Tr>
        <Tr>
          <Th isNumeric={true}>
            <Text>Delay Time:</Text>
          </Th>
          <Td>
            <Input
              type="text"
              defaultValue={1}
              onChange={e => updateTime(parseFloat(e.target.value))}
            ></Input>
          </Td>
          <Td>
            <Select
              defaultValue="hour"
              onChange={e => updateUnits(e.target.value)}
            >
              <option value="hour">Hour</option>
              <option value="sec">Sec</option>
              <option value="day">Day</option>
            </Select>
          </Td>
        </Tr>
        <Tr>
          <Td></Td>
          <Td>
            <Button w="100%" onClick={sendTransaction}>
              Send
            </Button>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};
