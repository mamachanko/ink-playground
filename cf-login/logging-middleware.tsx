import * as fs from 'fs';
import {Middleware, Action} from './store'; // eslint-disable-line import/named

const logToFile = (action: Action): void =>
	fs.appendFile(
		'/tmp/app.log',
		JSON.stringify(action) + '\n',
		() => { }
	);

export const loggingMiddleware: Middleware = _ => next => action => { // eslint-disable-line @typescript-eslint/explicit-function-return-type
	logToFile(action);
	next(action);
};
