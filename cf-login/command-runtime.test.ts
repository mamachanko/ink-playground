import {runCommand, outputReceived} from './actions';
import {initialState} from './reducer';
import {Middleware, StoreAPI} from './store'; // eslint-disable-line import/named

const createStoreMock = (): StoreAPI => ({
	dispatch: jest.fn(),
	// IDEA: this shouldn't have a dependency on reducer
	// maybe there's another way to create State
	getState: () => initialState
});

// IDEA: introduce childprocess type
const createChildProcessMock = (): any => {
	const listeners = {};
	return {
		stdout: {
			on: (event: string, callback: (output: string) => void) => {
				listeners[event] = callback;
			}
		},
		emit: (event: string, output: string) => {
			listeners[event](output);
		}
	};
};

const commandRuntime = (spawn, childProcess = null): Middleware => {
	return store => {
		const subscribe = (): void => {
			childProcess.stdout.on('data', data => {
				store.dispatch(outputReceived(data));
			});
		};

		if (childProcess !== null) {
			subscribe();
		}

		return next => action => {
			if (action.type === 'RUN_COMMAND') {
				childProcess = spawn(action.command);
				subscribe();
			}

			next(action);
		};
	};
};

describe('CommandRuntimeMiddleware', () => {
	it('starts to run a command', () => {
		const storeMock = createStoreMock();
		const nextMiddlewareMock = jest.fn();
		const runCommandAction = runCommand('test-command');
		const spawnMock = jest.fn().mockReturnValueOnce(createChildProcessMock());

		commandRuntime(spawnMock)(storeMock)(nextMiddlewareMock)(runCommandAction);

		expect(spawnMock).toHaveBeenLastCalledWith('test-command');
		expect(spawnMock).toHaveBeenCalledTimes(1);

		expect(nextMiddlewareMock).toHaveBeenCalledWith(runCommandAction);
		expect(nextMiddlewareMock).toHaveBeenCalledTimes(1);
	});

	it('emits command output', () => {
		const storeMock = createStoreMock();
		const subshell = createChildProcessMock();

		commandRuntime(null, subshell)(storeMock);

		subshell.emit('data', 'test command output');

		expect(storeMock.dispatch).toHaveBeenCalledWith(outputReceived('test command output'));
		expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
	});
});
