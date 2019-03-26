import * as React from 'react';
import {cleanup, render} from 'ink-testing-library';
import stripAnsi from 'strip-ansi';
import {CfLogin} from './cf-login';
import {StoreProvider} from './store';

const SPACE = ' ';

describe('<CfLogin />', () => {
	afterEach(() => {
		cleanup();
	});

	it('logs in', done => {
		const {lastFrame, stdin} = render(
			<StoreProvider>
				<CfLogin/>
			</StoreProvider>
		);

		expect(stripAnsi(lastFrame())).toContain('Welcome to cfpush');
		expect(stripAnsi(lastFrame())).toContain('press <space> to run');

		setTimeout(() => {
			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('running');

			setTimeout(() => {
				expect(stripAnsi(lastFrame())).toContain('CET');
				done();
			});
		});
	});
});
