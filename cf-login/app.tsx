import * as React from 'react';
import * as PropTypes from 'prop-types';
import {CfLogin} from './cf-login';
import { ChildProcess, spawn } from 'child_process';
import { start } from 'repl';

const initialState = {
	// TODO: state = UNSTARTED | STARTED | FINISHED
	running: false,
	finished: false,
	exitCode: -1,
	output: []
};
type State = typeof initialState;

interface Start { type: 'START' };
interface OutputReceived { type: 'OUTPUT_RECEIVED', output: string };
interface Finished { type: 'FINISHED', exitCode: number };
type Action = 
	| Start
	| OutputReceived
	| Finished;

const StateContext = React.createContext(initialState);
const DispatchContext = React.createContext((() => 0) as React.Dispatch<Action>);

export const useGlobalState = (): {state: State; dispatch: React.Dispatch<Action>} => ({
	state: React.useContext(StateContext),
	dispatch: React.useContext(DispatchContext)
});

const reducer = (state: State = initialState, action: Action): State => {
	if (action.type === 'START') {
		return {
			...state,
			running: true,
			finished: false,
			exitCode: -1,
			output: []
		};
	}
	
	if (action.type === 'OUTPUT_RECEIVED') {
		return {
			...state,
			output: [...state.output, action.output]
		};
	}

	if (action.type === 'FINISHED') {
		return {
			...state,
			running: false,
			finished: true,
			exitCode: action.exitCode
		};
	}

	return state;
};

class CommandRuntimeMiddleware {

	private subshell: ChildProcess = null;

	middleware() {
		return (store: State) => (next: React.Dispatch<Action>) => (action: Action) => {
			if (action.type === 'START') {
				this.subshell = spawn('date');

				this.subshell.stdout.on('data', output => {
					next({type: 'OUTPUT_RECEIVED', output: String(output)})
				});
				
				this.subshell.on('exit', code => {
					next({type: 'FINISHED', exitCode: code});
					this.subshell = null;
				});
			}
			
			next(action);
		};
	}	
}

const commandMiddleware = new CommandRuntimeMiddleware();

const GlobalStateProvider: React.ComponentType = ({children}): React.ReactElement => {
	const [state, dispatch] = React.useReducer(reducer, initialState);

	const enhancedDispatch = commandMiddleware.middleware()(state)(dispatch);

	return (
		<DispatchContext.Provider value={enhancedDispatch}>
			<StateContext.Provider value={state}>
				{children}
			</StateContext.Provider>
		</DispatchContext.Provider>
	);
};

GlobalStateProvider.propTypes = {
	children: PropTypes.node.isRequired
};

export const App = (): React.ReactElement => (
	<GlobalStateProvider>
		<CfLogin/>
	</GlobalStateProvider>
);
