import { Text } from 'ink';
import * as React from 'react';
import { useEffect, useState } from 'react';
import * as jsesc from 'jsesc';

const CTRL_C = '\x03'

const JustInput = ({ stdin, setRawMode }) => {
    const [input, setInput] = useState('');

    const quit = () => {
        console.log('ok. bye bye.');
        process.exit(0);
    }

    const handleInput = data => {
        switch (data) {
            case (CTRL_C):
                quit();
                break;
            default:
                setInput(previousInput => previousInput + jsesc(data));
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

    return <Text>Input: {input}</Text>
}

export default JustInput;
