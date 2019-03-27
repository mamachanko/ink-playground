import * as React from 'react';
import { Box, StdinContext } from 'ink';

const ARROW_UP = '\x1B[A';
const ARROW_DOWN = '\x1B[B';

const useStdin = handleInput => {
    const { stdin, setRawMode } = React.useContext(StdinContext);

    React.useEffect(() => {
        setRawMode(true);
        stdin.on('data', handleInput);

        return () => {
            stdin.removeListener('data', handleInput);
            setRawMode(false);
        }
    });
};

const initialState = {
    answers: [
        'answer 1',
        'answer 2',
        'answer 3'
    ],
    selection: 0
}

const reducer = (state, action) => {
    switch (action) {
        case ('MOVE_SELECTION_UP'):
            return {
                ...state,
                selection: (3 + (state.selection - 1)) % 3
            }
        case ('MOVE_SELECTION_DOWN'):
            return {
                ...state,
                selection: (state.selection + 1) % 3
            }
        default: throw Error(`unhandled action ${action}`);
    }
};

export const MultipleChoice = () => {
    const [{ answers, selection }, dispatch] = React.useReducer(reducer, initialState);

    const handleInput = (input: string) => {
        if (input === ARROW_UP) {
            dispatch('MOVE_SELECTION_UP')
        }
        if (input === ARROW_DOWN) {
            dispatch('MOVE_SELECTION_DOWN')
        }
    };

    useStdin(handleInput);

    return <Box flexDirection={'column'}>
        {'question'}
        {answers.map(
            (answer: string, index: number) => (index === selection) ? `-> ${answer}` : `   ${answer}`
        )}
    </Box>;
};
