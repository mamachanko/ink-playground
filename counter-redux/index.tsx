import { render } from 'ink';
import * as React from 'react';
import Counter from './Counter';

render(
    <Counter />,
    { exitOnCtrlC: false }
);
