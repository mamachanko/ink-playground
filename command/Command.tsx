import { spawn } from 'child_process';
import { Box, StdinContext, Text } from 'ink';
import Spinner from 'ink-spinner';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';

const CTRL_C = '\x03'

const Command = () => {
    const {stdin, setRawMode} = useContext(StdinContext);
    const [lines, setLines] = useState([]);
    const [running, setRunning] = useState(false);

    const append = line => setLines(currentLines => currentLines.concat([line]));

    const quit = () => {
        console.log('ok. bye bye.');
        process.exit(0);
    }
    
    const handleInput = data => {
        switch(data.toString()) {
            case(CTRL_C): quit();
        }
    };

    useEffect(() => {
        setRawMode(true);
        stdin.on('data', handleInput);    

        return () => {
            stdin.removeListener('data', handleInput);
            setRawMode(false);
        }
    });

    useEffect(() => {
        const gitLog = spawn('cf', ['target']);
        setRunning(true);

        gitLog.stdout.on('data', data =>
            append(data.toString())
        );

        gitLog.on('exit', code => {
            setRunning(false);
            append(`exited w/ ${code}`);
        });
    }, []);

    return <Box flexDirection={'column'}>
        {lines.map((line, index) => <Text key={index}>{line}</Text>)}
        {running ? <Spinner type='dots'/> : ''}
    </Box>;
}

export default Command;
