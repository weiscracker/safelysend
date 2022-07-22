import React from 'react';
import { useState } from 'react';
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
  Spinner,
} from '@chakra-ui/react';

export const SendTab = props => {
  const [processing, setProcessing] = useState(false);
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('0');
  const [time, setTime] = useState('1');
  const [units, setUnits] = useState(3600);
  const [unitsStr, setUnitsStr] = useState('hour');
  const [tip, setTip] = useState('0');

  async function sendTransaction() {
    if (props.state.account === '') {
      window.alert('Please connect wallet first');
      return;
    }
    setProcessing(true);
    await props.state.contract.methods
      .sendTransaction(
        receiver,
        parseInt(parseFloat(time) * parseFloat(units)),
        props.state.web3.utils.toWei(tip, 'ether')
      )
      .send({
        from: props.state.account,
        value: props.state.web3.utils.toWei(
          (parseFloat(amount) + parseFloat(tip)).toString(),
          'ether'
        ),
      });
    setProcessing(false);
    window.alert('Transaction Submitted');
  }

  function updateUnits(val) {
    var u = 1;
    if (val === 'hour') {
      u = 60 * 60;
    }
    if (val === 'day') {
      u = 60 * 60 * 24;
    }
    if (val === 'sec') {
      u = 1;
    }
    setUnits(u);
    setUnitsStr(val);
  }

  if (!processing) {
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
                defaultValue={receiver}
                onChange={e => setReceiver(e.target.value)}
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
                defaultValue={amount}
                onChange={e => setAmount(e.target.value)}
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
                defaultValue={time}
                onChange={e => setTime(e.target.value)}
              ></Input>
            </Td>
            <Td>
              <Select
                defaultValue={unitsStr}
                onChange={e => updateUnits(e.target.value)}
              >
                <option value="hour">Hour</option>
                <option value="sec">Sec</option>
                <option value="day">Day</option>
              </Select>
            </Td>
          </Tr>
          <Tr>
            <Th isNumeric={true}>
              <Text>Optional Tip to Send to Contract:</Text>
            </Th>
            <Td>
              <Input
                type="text"
                defaultValue={tip}
                onChange={e => setTip(e.target.value)}
              ></Input>
            </Td>
            <Td>Eth</Td>
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
  } else {
    return <Spinner></Spinner>;
  }
};
