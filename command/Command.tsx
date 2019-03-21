import { spawn } from 'child_process';
import { Box, StdinContext, Text } from 'ink';
import Spinner from 'ink-spinner';
import * as React from 'react';
import { useContext, useEffect, useState, useRef } from 'react';
import { start } from 'repl';

const CTRL_C = '\x03'
const SPACE = ' ';

const useStdin = (handleInput) => {
    const { stdin, setRawMode } = useContext(StdinContext);

    useEffect(() => {
        setRawMode(true);
        stdin.on('data', handleInput);

        return () => {
            stdin.removeListener('data', handleInput);
            setRawMode(false);
        }
    });
}

const useCommand = (command: string) => {
    const [started, setStarted] = useState(false);
    const [stdout, setStdout] = useState([]);
    const [exitCode, setExitCode] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    const append = (line: any) =>
        setStdout(previousStdout => previousStdout.concat([String(line)]));

    const run = (command: string) => {
        const [commandName, ...args] = command.split(' ');
        return spawn(commandName, args);
    }

    useEffect(() => {
        if (!started) return;
        const subshell = run(command);
        setIsRunning(true);

        subshell.stdout.on('data', append);

        subshell.on('exit', code => {
            setIsRunning(false);
            setExitCode(code);
        });
    }, [started]);

    const start = () => setStarted(true);

    return { start, stdout, isRunning, exitCode };
};

const Command = () => {
    const triggered = useRef(false);

    const quit = () => {
        console.log('ok. bye bye.');
        process.exit(0);
    }

    const {
        start,
        stdout,
        isRunning,
        exitCode,
    } = useCommand('cf target');

    const handleInput = data => {
        switch (data.toString()) {
            case (CTRL_C): quit();
            case (SPACE): {
                start();
                triggered.current = true;
            };
        }
    };

    useStdin(handleInput);

    return triggered.current ?
        <Box flexDirection={'column'}>
            {stdout.map((line, index) => <Text key={index}>{line}</Text>)}
            {isRunning ?
                <Spinner type='dots' />
                : `finished with exit code ${exitCode}`}
        </Box> :
        <Text>{'press <space> to run'}</Text>;
}

export default Command;
