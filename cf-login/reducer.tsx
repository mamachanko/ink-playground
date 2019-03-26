import {State, Action, Reducer} from './store'; // eslint-disable-line import/named

export const initialState = {
	// Idea: state = UNSTARTED | STARTED | FINISHED
	running: false,
	finished: false,
	inputRequested: false,
	exitCode: -1,
	output: []
};

export const reducer: Reducer = (state: State = initialState, action: Action): State => {
	if (action.type === 'START') {
		return {
			...state,
			running: true,
			finished: false,
			inputRequested: false,
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

	if (action.type === 'INPUT_REQUESTED') {
		return {
			...state,
			inputRequested: true
		};
	}

	if (action.type === 'INPUT_RECEIVED') {
		return {
			...state,
			inputRequested: false
		};
	}

	if (action.type === 'FINISHED') {
		return {
			...state,
			running: false,
			finished: true,
			inputRequested: false,
			exitCode: action.exitCode
		};
	}

	return state;
};
