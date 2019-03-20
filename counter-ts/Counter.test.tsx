import * as React from 'react';
import { render, cleanup } from 'ink-testing-library';
import Counter from './Counter';
import stripAnsi from 'strip-ansi';
import { StdinContext } from 'ink';

describe('<Counter />', () => {

    beforeEach(() => {
        jest.useFakeTimers();
    })

    afterEach(() => {
        cleanup();
        jest.clearAllTimers();
    });

    it('counts up', () => {
        const { lastFrame, stdin } = render(<Counter />);

        expect(stripAnsi(lastFrame())).toContain('Counter: 0');

        stdin.write(' ');
        jest.advanceTimersByTime(500);
        expect(stripAnsi(lastFrame())).toContain('Counter: 1');

        stdin.write(' ');
        jest.advanceTimersByTime(500);
        expect(stripAnsi(lastFrame())).toContain('Counter: 2');

        stdin.write(' ');
        jest.advanceTimersByTime(500);
        expect(stripAnsi(lastFrame())).toContain('Counter: 3');
    });
});
