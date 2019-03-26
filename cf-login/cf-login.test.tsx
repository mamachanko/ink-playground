import * as React from 'react';
import {cleanup, render} from 'ink-testing-library';
import stripAnsi from 'strip-ansi';
import {CfLogin} from './cf-login';
import {StoreProvider} from './store';

const SPACE = ' ';

const sleep = (ms?: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms || 0));

describe('<CfLogin />', () => {
	afterEach(() => {
		cleanup();
	});

	it('logs in', async () => {
		const {lastFrame, stdin} = render(
			<StoreProvider>
				<CfLogin/>
			</StoreProvider>
		);

		expect(stripAnsi(lastFrame())).toContain('Welcome to cfpush');
		expect(stripAnsi(lastFrame())).toContain('press <space> to run "echo hello there"');

		await sleep();
		stdin.write(SPACE);
		expect(stripAnsi(lastFrame())).toContain('running');

		await sleep();
		expect(stripAnsi(lastFrame())).toContain('hello there');
		expect(stripAnsi(lastFrame())).not.toContain('running');

		await sleep();
		stdin.write(SPACE);
		expect(stripAnsi(lastFrame())).toContain('running');

		await sleep();
		expect(stripAnsi(lastFrame())).toContain('hello there');
		expect(stripAnsi(lastFrame())).not.toContain('running');
	});
});
