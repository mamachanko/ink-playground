import * as React from 'react';
import {Provider} from 'react-redux';
import {configureStore} from 'redux-starter-kit';
import {Command} from './command';
import {CommandRuntimeMiddleware} from './command-runtime';
import {loggingMiddleware} from './logging-middleware';
import {reducer} from './reducer';
import {Title} from './title';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CF_LOGIN = 'cf login -a api.run.pivotal.io --sso';
const DATE = 'date';

type AppProps = {
	command?: string;
}

const store = configureStore({
	reducer,
	middleware: [
		new CommandRuntimeMiddleware().middleware(),
		loggingMiddleware
	]
});

export const App: React.FunctionComponent<AppProps> = ({command = DATE}): React.ReactElement => {
	return (
		<Provider store={store}>
			<Title/>
			<Command command={command}/>
		</Provider>
	);
};
