import {ChildProcess, spawn} from 'child_process';
import {Action} from './store'; // eslint-disable-line import/named

class CommandRuntimeMiddleware {
	private _subshell: ChildProcess = null;

	middleware(): (next: React.Dispatch<Action>) => (action: Action) => void {
		return next => action => {
			if (action.type === 'START') {
				const [fileName, ...args] = action.command.split(' ');
				this._subshell = spawn(fileName, args);

				this._subshell.stdout.on('data', (output: any) => {
					if (String(output).endsWith('> ')) {
						next({type: 'INPUT_REQUESTED'});
					}

					next({type: 'OUTPUT_RECEIVED', output: String(output)});
				});

				this._subshell.on('exit', code => {
					next({type: 'FINISHED', exitCode: code});
					this._subshell = null;
				});
			}

			if (action.type === 'INPUT_RECEIVED') {
				this._subshell.stdin.write(action.input + '\n');
			}

			next(action);
		};
	}
}
export const commandMiddleware = new CommandRuntimeMiddleware();
