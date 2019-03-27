import * as React from 'react';
import { Box } from 'ink';
import { reducer, State, moveSelectionUp, moveSelectionDown } from './reducer';
import { useStdin } from './use-stdin';

const ARROW_UP = '\x1B[A';
const ARROW_DOWN = '\x1B[B';

const initialState: State = {
    before: [],
    selected: 'answer 1',
    after: [
        'answer 2',
        'answer 3'
    ]
}

export const MultipleChoice = () => {
    const [{ before, selected, after }, dispatch] = React.useReducer(reducer, initialState);

    const handleInput = (input: string) => {
        if (input == ARROW_UP) dispatch(moveSelectionUp());
        if (input == ARROW_DOWN) dispatch(moveSelectionDown());
    };

    useStdin(handleInput);

    return <Box flexDirection={'column'}>
        {'question'}
        {before.map(answer => `   ${answer}`)}
        {`-> ${selected}`}
        {after.map(answer => `   ${answer}`)}
    </Box>;
};
