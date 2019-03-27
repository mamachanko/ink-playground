import * as React from 'react';
import { render, cleanup } from 'ink-testing-library';
import { MultipleChoice } from './multiple-choice';

const sleep = (ms?: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms || 0));

const ARROW_UP = '\x1B[A';
const ARROW_DOWN = '\x1B[B';

describe('<MultipleChoice/>', () => {

    afterEach(() => {
        cleanup();
    });

    it('selects the first answer by default', () => {
        // Should we use a HOC or props?
        const { lastFrame } = render(<MultipleChoice />);
        
        expect(lastFrame()).toMatch(/question\n-> answer 1\n   answer 2\n   answer 3/i);
    });
    
    it('moves selection', async () => {
        const { lastFrame, stdin } = render(<MultipleChoice />);
        
        expect(lastFrame()).toMatch(/question\n-> answer 1\n   answer 2\n   answer 3/i);
        
        await sleep();        
        stdin.write(ARROW_DOWN);
        expect(lastFrame()).toMatch(/question\n   answer 1\n-> answer 2\n   answer 3/i);
        
        await sleep();        
        stdin.write(ARROW_DOWN);
        expect(lastFrame()).toMatch(/question\n   answer 1\n   answer 2\n-> answer 3/i);

        await sleep();        
        stdin.write(ARROW_DOWN);
        expect(lastFrame()).toMatch(/question\n-> answer 1\n   answer 2\n   answer 3/i);

        await sleep();        
        stdin.write(ARROW_UP);
        expect(lastFrame()).toMatch(/question\n   answer 1\n   answer 2\n-> answer 3/i);

        await sleep();        
        stdin.write(ARROW_UP);
        expect(lastFrame()).toMatch(/question\n   answer 1\n-> answer 2\n   answer 3/i);

        await sleep();        
        stdin.write(ARROW_UP);
        expect(lastFrame()).toMatch(/question\n-> answer 1\n   answer 2\n   answer 3/i);
    });
});
