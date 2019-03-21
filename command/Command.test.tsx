import { cleanup, render } from 'ink-testing-library';
import * as React from 'react';
import Command from './Command';

describe('<Command />', () => {

    afterEach(() => {
        cleanup();
    });

    it('runs command and displays output', () => {
        const { lastFrame } = render(<Command />);

        expect(lastFrame()).toContain('press <space> to run');
    });
});
