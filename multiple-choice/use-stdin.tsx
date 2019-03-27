import * as React from 'react';
import { StdinContext } from 'ink';

export const useStdin = (handleInput: (input: string) => void) => {
    const { stdin, setRawMode } = React.useContext(StdinContext);

    React.useEffect(() => {
        setRawMode(true);
        stdin.on('data', handleInput);

        return () => {
            stdin.removeListener('data', handleInput);
            setRawMode(false);
        };
    });
};
