import { Box, Color, StdinContext } from 'ink';
import Spinner from 'ink-spinner';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';

const CTRL_C = '\x03'
const SPACE = ' ';

const Counter = () => {
    const {stdin, setRawMode} = useContext(StdinContext);
    const [counter, setCounter] = useState(0);
    const [incrementing, setIncrementing] = useState(false);

    const increment = () => setCounter(counter => counter + 1);

    const slowIncrement = () => {
        if (incrementing) return;
        setIncrementing(true);
        setTimeout(() => {
            increment();
            setIncrementing(false);
        }, 500);
    }

    const quit = () => {
        console.log('ok. bye bye.');
        process.exit(0);
    }
    
    const handleInput = data => {
        switch(data.toString()) {
            case(CTRL_C): quit();
            case(SPACE): slowIncrement();
        }
    };

    setRawMode(true);
    stdin.on('data', handleInput);

    useEffect(() => {
        return () => {
            stdin.removeListener('data', handleInput);
            setRawMode(false);
        }
    });

    return <Box>
        <Box width={2}>
            {incrementing ? <Spinner type='dots' />: undefined}
        </Box>
        <Box>
            Counter: <Color green>{counter}</Color>
        </Box>
    </Box>
}

export default Counter;
