import { spawn } from 'child_process';
import { Box, Text } from 'ink';
import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { useGlobalState } from './App';

const useCommand = (command: string) => {
    const {dispatch} = useGlobalState();

    const receiveOutput = useCallback(
        output => dispatch({ type: 'OUTPUT_RECEIVED', payload: String(output) }),
        [dispatch]
    );

    useEffect(() => {
        const [fileName, ...args] = command.split(' ');
        const subshell = spawn(fileName, args);

        subshell.stdout.on('data', receiveOutput);

        return () => subshell.stdout.removeListener('data', receiveOutput);
    }, [command, receiveOutput]);
};

export const GitLog = () => {
    const {state: {output}} = useGlobalState();

    useCommand('git log');

    return <Box flexDirection={'column'}>
        {output.map((text, index) =>
            <Text key={index}>{text ? text : ' '}</Text>)}
    </Box>;
};
