import {MiddlewareAPI, Middleware} from 'redux';
import {runCommand, outputReceived, inputRequired, finished} from './actions';
import {initialState} from './reducer';

const createStoreMock = (): MiddlewareAPI => ({
	dispatch: jest.fn(),
	// IDEA: this shouldn't have a dependency on reducer
	// maybe there's another way to create State
	getState: () => initialState
});

// IDEA: introduce childprocess type
const createChildProcessMock = (): any => {
	const listeners = {
		stdout: null,
		exit: null
	};
	return {
		stdout: {
			on: (event: string, callback: (output: string) => void) => {
				if (event !== 'data') {
					throw new Error(`unexpected event listener on '${event}'. expected 'data'.`);
				}

				if (listeners.stdout !== null) {
					throw new Error('event listener on stdout \'data\' already exists');
				}

				listeners.stdout = callback;
			},
			emit: (output: string) => {
				listeners.stdout(output);
			}
		},
		on: (event: string, callback: (output: string) => void) => {
			if (event !== 'exit') {
				throw new Error(`unexpected event listener on '${event}'. expected 'exit'.`);
			}

			if (listeners.exit !== null) {
				throw new Error('event listener on \'exit\' already exists');
			}

			listeners.exit = callback;
		},
		exit: (exitCode: number) => {
			listeners.exit(exitCode);
		}
	};
};

const commandRuntime = (spawn, childProcess = null): Middleware => {
	return store => {
		const subscribe = (): void => {
			childProcess.stdout.on('data', (data: string) => {
				store.dispatch(outputReceived(data));
				if (data.endsWith('> ')) {
					store.dispatch(inputRequired());
				}
			});

			childProcess.on('exit', (code: number) => {
				store.dispatch(finished(code));
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
		const childProcessMock = createChildProcessMock();
		const spawnMock = jest.fn().mockReturnValueOnce(childProcessMock);

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

		subshell.stdout.emit('test command output');

		expect(storeMock.dispatch).toHaveBeenCalledWith(outputReceived('test command output'));
		expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
	});

	it('emits command input required', () => {
		const storeMock = createStoreMock();
		const childProcessMock = createChildProcessMock();

		commandRuntime(null, childProcessMock)(storeMock);

		childProcessMock.stdout.emit('input required > ');

		expect(storeMock.dispatch).toHaveBeenCalledWith(outputReceived('input required > '));
		expect(storeMock.dispatch).toHaveBeenCalledWith(inputRequired());
		expect(storeMock.dispatch).toHaveBeenCalledTimes(2);
	});

	it('emits command finished', () => {
		const storeMock = createStoreMock();
		const childProcessMock = createChildProcessMock();

		commandRuntime(null, childProcessMock)(storeMock);

		childProcessMock.exit(123);

		expect(storeMock.dispatch).toHaveBeenCalledWith(finished(123));
		expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
	});
});
