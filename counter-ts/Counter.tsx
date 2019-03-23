import { Box, Color, StdinContext } from 'ink';
import Spinner from 'ink-spinner';
import * as React from 'react';
import { useContext, useEffect, useState, useCallback } from 'react';

const CTRL_C = '\x03'
const SPACE = ' ';

const useStdin = handleInput => {
    const { stdin, setRawMode } = useContext(StdinContext);

    useEffect(() => {
        setRawMode(true);
        stdin.on('data', handleInput);

        return () => {
            stdin.removeListener('data', handleInput);
            setRawMode(false);
        }
    });
};

const quit = () => {
    console.log('ok. bye bye.');
    process.exit(0);
}

const useSlowCounter = () => {
    const [counter, setCounter] = useState(0);
    const [isIncrementing, setIncrementing] = useState(false);
    
    const increment = useCallback(() => {
        if (isIncrementing) return;
        setIncrementing(true);
        setTimeout(() => {
            setCounter(counter => counter + 1);
            setIncrementing(false);
        }, 500);
    }, [isIncrementing]);

    return {counter, isIncrementing, increment};
};

const Counter = () => {
    const {
        counter, 
        isIncrementing, 
        increment
    } = useSlowCounter();

    useStdin(input => {
        switch (input) {
            case (CTRL_C): quit();
            case (SPACE): increment();
        }
    });

    return <Box>
        <Box width={2}>
            {isIncrementing ?
                <Spinner type='dots' /> :
                undefined}
        </Box>
        <Box>
            Counter: <Color green>{counter}</Color>
        </Box>
    </Box>
}

export default Counter;
