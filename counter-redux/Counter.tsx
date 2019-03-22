import { StdinContext, Text } from 'ink';
import * as React from 'react';
import { useContext, useEffect, useCallback } from 'react';
import { useDispatch, useGlobalState } from './App';

const CTRL_C = '\x03';
const SPACE = ' ';

const Counter = () => {
    const { stdin, setRawMode } = useContext(StdinContext);
    const state = useGlobalState();
    const dispatch = useDispatch();
    const increment = useCallback(() => dispatch({type: 'INCREMENT'}), [dispatch]);
    
    // TODO: move stdin usage to custom hook -> useStdin
    const handleInput = (data: string) => {
        if (data === SPACE) increment();
    };

    useEffect(() => {
        setRawMode(true);
        stdin.on('data', handleInput);

        return () => {
            setRawMode(false);
            stdin.removeListener('data', handleInput);
        };
    });

    return <Text>count: {state.count}</Text>;
};

export default Counter;
