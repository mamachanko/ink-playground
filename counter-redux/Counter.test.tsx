import { cleanup, render } from 'ink-testing-library';
import * as React from 'react';
import Counter from './Counter';

describe('<Counter />', () => {

    afterEach(() => {
        cleanup();
    });

    it('counts', () => {
        const { lastFrame, stdin } = render(<Counter />);

        expect(lastFrame()).toEqual('0');
        
        stdin.write(' ');

        expect(lastFrame()).toEqual('1');
    });
});
