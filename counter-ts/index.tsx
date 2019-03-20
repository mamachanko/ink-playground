import { render, StdinContext } from 'ink';
import * as React from 'react';
import Counter from './Counter';

render(
    <StdinContext.Consumer>
        {
            ({ stdin, setRawMode }) =>
                <Counter stdin={stdin} setRawMode={setRawMode} />
        }
    </StdinContext.Consumer>,
    { exitOnCtrlC: false }
);
