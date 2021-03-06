import {Reducer} from 'redux';
import {Action} from './actions'; // eslint-disable-line import/named

interface State {
	running: boolean;
	finished: boolean;
	inputRequired: boolean;
	exitCode: number;
	output: string[];
}

export const initialState = {
	// Idea: state = UNSTARTED | STARTED | FINISHED
	running: false,
	finished: false,
	inputRequired: false,
	exitCode: -1,
	output: []
};

export const reducer: Reducer = (state: State = initialState, action: Action): State => {
	if (action.type === 'RUN_COMMAND') {
		return {
			...state,
			running: true,
			finished: false,
			inputRequired: false,
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

	if (action.type === 'INPUT_REQUIRED') {
		return {
			...state,
			inputRequired: true
		};
	}

	if (action.type === 'INPUT_RECEIVED') {
		return {
			...state,
			inputRequired: false
		};
	}

	if (action.type === 'FINISHED') {
		return {
			...state,
			running: false,
			finished: true,
			inputRequired: false,
			exitCode: action.exitCode
		};
	}

	return state;
};
