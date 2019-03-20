import { StdinContext } from 'ink';
import { cleanup, render } from 'ink-testing-library';
import * as React from 'react';
import JustInput from './JustInput';

describe('<JustInput />', () => {

    afterEach(() => {
        cleanup();
    });

    it('shows input', () => {
        const { lastFrame, stdin } = render(
            <StdinContext.Consumer>
                {
                    ({ stdin, setRawMode }) =>
                        <JustInput stdin={stdin} setRawMode={setRawMode} />
                }
            </StdinContext.Consumer>
        );

        expect(lastFrame()).toEqual('Input:');

        stdin.write('xyz');
        
        expect(lastFrame()).toEqual('Input: xyz');
    });
});
