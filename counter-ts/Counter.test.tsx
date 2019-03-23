import { cleanup, render } from 'ink-testing-library';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import stripAnsi from 'strip-ansi';
import Counter from './Counter';

describe('<Counter />', () => {

    afterEach(() => {
        cleanup();
        jest.clearAllTimers();
    });
    
    it('counts up', (done) => {
        jest.useRealTimers();        

        const { lastFrame, stdin } = render(<Counter />);
        
        expect(stripAnsi(lastFrame())).toContain('Counter: 0');

        setTimeout(() => {
            jest.useFakeTimers();

            stdin.write(' ');
            jest.advanceTimersByTime(500);
            expect(stripAnsi(lastFrame())).toContain('Counter: 1');

            stdin.write(' ');
            jest.advanceTimersByTime(500);
            expect(stripAnsi(lastFrame())).toContain('Counter: 2');
    
            stdin.write(' ');
            jest.advanceTimersByTime(500);
            expect(stripAnsi(lastFrame())).toContain('Counter: 3');

            done();
        });
    });
});
