import * as React from 'react';
import * as PropTypes from 'prop-types';
import {commandMiddleware} from './command-runtime';

const initialState = {
	// Idea: state = UNSTARTED | STARTED | FINISHED
	running: false,
	finished: false,
	exitCode: -1,
	output: []
};

type State = typeof initialState;

interface Start {
	type: 'START';
}

interface OutputReceived {
	type: 'OUTPUT_RECEIVED';
	output: string;
}

interface Finished {
	type: 'FINISHED';
	exitCode: number;
}

export type Action =
	| Start
	| OutputReceived
	| Finished;

const StateContext = React.createContext(initialState);
const DispatchContext = React.createContext((() => 0) as React.Dispatch<Action>);

export const useStore = (): {
	state: State;
	dispatch: React.Dispatch<Action>;
} => ({
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

export const StoreProvider: React.ComponentType = ({children}): React.ReactElement => {
	const [state, dispatch] = React.useReducer(reducer, initialState);
	const enhancedDispatch = commandMiddleware.middleware()(dispatch);
	return (
		<DispatchContext.Provider value={enhancedDispatch}>
			<StateContext.Provider value={state}>
				{children}
			</StateContext.Provider>
		</DispatchContext.Provider>
	);
};

StoreProvider.propTypes = {
	children: PropTypes.node.isRequired
};
