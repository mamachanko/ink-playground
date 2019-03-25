import * as React from 'react';
import {cleanup, render} from 'ink-testing-library';
import {CfLogin} from './cf-login';

describe('<CfLogin />', () => {
	afterEach(() => {
		cleanup();
	});

	it('logs in', () => {
		const {lastFrame} = render(<CfLogin/>);

		expect(lastFrame()).toContain('press <space> to run');
	});
});
