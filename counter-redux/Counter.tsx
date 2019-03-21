import { Box, StdinContext, Text } from 'ink';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';

const CTRL_C = '\x03';
const SPACE = ' ';

const Counter = () => {
    const {stdin, setRawMode} = useContext(StdinContext);
    const [count, setCount] = useState(0);

    const handleInput = data => {
        if (data === SPACE) setCount(count + 1);
        if (data === CTRL_C) process.exit(1);
    };
    
    setRawMode(true);
    stdin.on('data', handleInput);

    useEffect(() => {
        return () => {
            setRawMode(false);
            stdin.removeListener('data', handleInput);
        };
    });

    return <Text>{count}</Text>;
};

export default Counter;
