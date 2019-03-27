import * as React from 'react';
import { Box, Text } from 'ink';
import { reducer, State, moveSelectionUp, moveSelectionDown } from './reducer';
import { useStdin } from './use-stdin';

const ARROW_UP = '\x1B[A';
const ARROW_DOWN = '\x1B[B';
const SELECTION_MARKER = '->';

const initialState: State = {
    before: [],
    selected: 'answer 1',
    after: [
        'answer 2',
        'answer 3'
    ]
}

const Selected: React.FC = ({ children }) => <Box>
    <Box width={3}>{SELECTION_MARKER}</Box>
    {children}
</Box>;

const Unselected: React.FC = ({ children }) => <Box>
    <Box width={3}/>
    {children}
</Box>;

export const MultipleChoice = () => {
    const [{ before, selected, after }, dispatch] = React.useReducer(reducer, initialState);

    const handleInput = (input: string) => {
        if (input == ARROW_UP) dispatch(moveSelectionUp());
        if (input == ARROW_DOWN) dispatch(moveSelectionDown());
    };

    useStdin(handleInput);

    return <Box flexDirection={'column'}>
        <Text>{'question'}</Text>
        <Box flexDirection={'column'}>
            {before.map(answer => <Unselected key={answer}>{answer}</Unselected>)}
            <Selected>{selected}</Selected>
            {after.map(answer => <Unselected key={answer}>{answer}</Unselected>)}
        </Box>
    </Box>;
};
