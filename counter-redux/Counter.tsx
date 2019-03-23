import { StdinContext, Text } from 'ink';
import * as React from 'react';
import { useCallback, useContext, useEffect } from 'react';
import { useGlobalState } from './App';

const SPACE = ' ';

const useStdin = (handleInput) => {
    const { stdin, setRawMode } = useContext(StdinContext);
    useEffect(() => {
        setRawMode(true);
        stdin.on('data', handleInput);

        return () => {
            setRawMode(false);
            stdin.removeListener('data', handleInput);
        };
    });
};

const Counter = () => {
    const { state, dispatch } = useGlobalState();
    const increment = useCallback(() => dispatch({ type: 'INCREMENT' }), [dispatch]);

    const handleInput = (input: string) => {
        if (input === SPACE) increment();
    };

    useStdin(handleInput);

    return <Text>count: {state.count}</Text>;
};

export default Counter;
