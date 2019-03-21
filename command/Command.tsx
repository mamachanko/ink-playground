import { spawn } from 'child_process';
import { Box, StdinContext, Text } from 'ink';
import Spinner from 'ink-spinner';
import * as React from 'react';
import { useContext, useEffect, useState, useRef } from 'react';
import * as jsesc from 'jsesc';

const CTRL_C = '\x03';
const ENTER = '\r';
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
    const subshell = useRef(null);
    const subscribed = useRef(false);
    const [started, setStarted] = useState(false);
    const [stdout, setStdout] = useState([]);
    const [exitCode, setExitCode] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [userInputNeeded, setUserInputNeeded] = useState(false);

    const run = (command: string) => {
        const [commandName, ...args] = command.split(' ');
        return spawn(commandName, args);
    }

    if (subshell.current && !subscribed.current) {
        subshell.current.stdout.on('data', (data) => {
            const output = String(data);
            setStdout(previousStdout => previousStdout.concat([output]))
        });

        subshell.current.on('exit', code => {
            setIsRunning(false);
            setExitCode(code);
        });

        subscribed.current = true;
    }

    useEffect(() => {
        if (!started) return;
        subshell.current = run(command);
        setIsRunning(true);
    }, [started]);

    useEffect(() => {
        const latest: string = stdout[stdout.length - 1];
        if (latest) setUserInputNeeded(latest.endsWith('> '));
    }, [stdout]);

    const writeUserInput = (userInput) => {
        if (subshell.current) subshell.current.stdin.write(userInput + '\n');
    }

    return {
        start: () => setStarted(true),
        stdout,
        isRunning,
        exitCode,
        userInputNeeded,
        writeUserInput
    };
};

const Command = () => {
    const triggered = useRef(false);
    const [userInput, setUserInput] = useState('');

    const quit = () => {
        console.log('ok. bye bye.');
        process.exit(0);
    }


    const {
        start,
        stdout,
        isRunning,
        exitCode,
        userInputNeeded,
        writeUserInput,
    } = useCommand('cf login -a api.run.pivotal.io --sso');

    const submit = () => {
        writeUserInput(userInput);
        setUserInput('');
    };

    const handleInput = data => {
        switch (data.toString()) {
            case (CTRL_C):
                quit();
                break;
            case (SPACE):
                start();
                triggered.current = true;
                break;
            case (ENTER): 
                submit();
                break;
            default: 
                setUserInput(previousUserInput => previousUserInput + data);
        }
    };

    useStdin(handleInput);

    return triggered.current ?
        <Box flexDirection={'column'}>
            {stdout.map((line, index) => <Text key={index}>{line}</Text>)}
            {userInputNeeded ?
                'user input needed > ' + jsesc(userInput)
                : ''}
            {isRunning ?
                <Spinner type='dots' />
                : `finished with exit code ${exitCode}`}
        </Box> :
        <Text>{'press <space> to run'}</Text>;
}

export default Command;
