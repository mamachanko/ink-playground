import {ChildProcess, spawn} from 'child_process';
import {Action} from './store'; // eslint-disable-line import/named

class CommandRuntimeMiddleware {
	private _subshell: ChildProcess = null;

	middleware(): (next: React.Dispatch<Action>) => (action: Action) => void {
		return next => action => {
			if (action.type === 'START') {
				this._subshell = spawn('date');

				this._subshell.stdout.on('data', output => {
					next({type: 'OUTPUT_RECEIVED', output: String(output)});
				});

				this._subshell.on('exit', code => {
					next({type: 'FINISHED', exitCode: code});
					this._subshell = null;
				});
			}

			next(action);
		};
	}
}
export const commandMiddleware = new CommandRuntimeMiddleware();
