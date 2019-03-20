import { render } from 'ink';
import * as React from 'react';
import Command from './Command';

render(
    <Command />,
    { exitOnCtrlC: false }
);
