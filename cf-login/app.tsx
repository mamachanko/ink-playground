import * as React from 'react';
import {Command} from './command';
import {CommandRuntimeMiddleware} from './command-runtime';
import {initialState, reducer} from './reducer';
import {createStore, StoreProvider} from './store';
import {Title} from './title';
import {loggingMiddleware} from './logging-middleware';

const commandRuntimeMiddleware = new CommandRuntimeMiddleware().middleware();

const middlewares = [
	commandRuntimeMiddleware,
	loggingMiddleware
];

type AppProps = {
	command?: string;
}

export const App: React.FunctionComponent<AppProps> = ({command = 'date'}): React.ReactElement => {
	const store = createStore(reducer, initialState, middlewares);

	return (
		<StoreProvider store={store}>
			<Title/>
			<Command command={command}/>
		</StoreProvider>
	);
};
