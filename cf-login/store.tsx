import * as React from 'react';
import {initialState} from './reducer';

export interface State {
	running: boolean;
	finished: boolean;
	inputRequested: boolean;
	exitCode: number;
	output: string[];
}

interface Start {
	type: 'START';
	command: string;
}

interface OutputReceived {
	type: 'OUTPUT_RECEIVED';
	output: string;
}

interface InputRequested {
	type: 'INPUT_REQUESTED';
}

interface InputReceived {
	type: 'INPUT_RECEIVED';
	input: string;
}

interface Finished {
	type: 'FINISHED';
	exitCode: number;
}

export type Action =
	| Start
	| OutputReceived
	| InputRequested
	| InputReceived
	| Finished;

export type Reducer = (state: State, action: Action) => State;

const StateContext = React.createContext(initialState);
const DispatchContext = React.createContext((() => 0) as React.Dispatch<Action>);

export const useStore = (): {
	state: State;
	dispatch: React.Dispatch<Action>;
} => ({
	state: React.useContext(StateContext),
	dispatch: React.useContext(DispatchContext)
});

export interface Store {
	state: State;
	dispatch: React.Dispatch<Action>;
}

type StoreProviderProps = {
	store: Store;
};

export const StoreProvider: React.FunctionComponent<StoreProviderProps> = ({store: {state, dispatch}, children}): React.ReactElement => (
	<DispatchContext.Provider value={dispatch}>
		<StateContext.Provider value={state}>
			{children}
		</StateContext.Provider>
	</DispatchContext.Provider>
);

type StoreAPI = {
	getState: () => State;
	dispatch: (action: Action) => void;
}

export type Middleware = (store: StoreAPI) => MiddlewareChainable;

type NextMiddleware = (action: Action) => void;

type MiddlewareChainable = (next: NextMiddleware) => (action: Action) => void;

export const createStore = (reducer: Reducer, initialState: State, middlewares?: Middleware[]): Store => {
	const [state, dispatch] = React.useReducer(reducer, initialState); // eslint-disable-line react-hooks/rules-of-hooks

	if (typeof middlewares === undefined) {
		return {state, dispatch};
	}

	const storeAPI = {
		getState: () => state,
		dispatch: (action: Action) => dispatch(action)
	};

	const compose = (...ms: MiddlewareChainable[]) => { // eslint-disable-line @typescript-eslint/explicit-function-return-type
		return (f: any) => ms.reduceRight((composed, m) => m(composed), f);
	};

	const middlewareChain: MiddlewareChainable[] = middlewares.map(middleware => middleware(storeAPI));

	return {
		state,
		dispatch: compose(...middlewareChain)(dispatch)
	};
};
