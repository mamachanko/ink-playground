import { Text } from 'ink';
import * as React from 'react';
import { useEffect, useState } from 'react';

const CTRL_C = '\x03'

const JustInput = ({ stdin, setRawMode }) => {
    const [content, setContent] = useState('');

    const quit = () => {
        console.log('ok. bye bye.');
        process.exit(0);
    }

    const handleInput = data => {
        const input = data.toString();
        switch(input) {
            case(CTRL_C): quit();
            default: setContent(currentContent => currentContent + input);
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

    return <Text>Input: {content}</Text>
}

export default JustInput;
