import * as React from 'react';
import * as InkBox from 'ink-box';
import {Color} from 'ink';
import {Command} from './command';
import {StoreProvider} from './store';

const Title = (): React.ReactElement => (
	<InkBox
		borderStyle="round"
		borderColor="cyan"
	>
		Welcome to <Color green>cfpush</Color>
	</InkBox>
);

export const App = (): React.ReactElement => (
	<StoreProvider>
		<Title/>
		<Command command="date"/>
	</StoreProvider>
);
