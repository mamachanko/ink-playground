import { render, StdinContext } from 'ink';
import * as React from 'react';
import JustInput from './JustInput';

render(
    <StdinContext.Consumer>
        {
            ({ stdin, setRawMode }) =>
                <JustInput stdin={stdin} setRawMode={setRawMode} />
        }
    </StdinContext.Consumer>,
    { exitOnCtrlC: false }
);
