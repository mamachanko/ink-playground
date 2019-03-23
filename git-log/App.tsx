import * as React from 'react';
import { GitLog} from './GitLog';
import { createContext, useContext, useReducer } from 'react';

const initialState = {
    output: [
        'commit 0836e7cd6314bdbde68dfaf55dfa17bd8bb144e4 (HEAD -> master, origin/master)',
        'Author: mamachanko <sugardubz@gmail.com>',
        'Date:   Sat Mar 23 13:18:17 2019 +0100',
        '',
        '    refactor Counter redux',
        '',
        'commit 6f7faf585ac4d4ba39fb4a08401818e70418282c',
        'Author: mamachanko <sugardubz@gmail.com>',
        'Date:   Sat Mar 23 12:56:25 2019 +0100',
        '',
        '    refactor Counter ts',
    ]
};
type State = typeof initialState;

interface OutputReceived { type: 'OUTPUT_RECEIVED', payload: string };
type Action = | OutputReceived;

const StateContext = createContext(initialState);
const DispatchContext = createContext((() => 0) as React.Dispatch<Action>);

export const useGlobalState = () => ({
    state: useContext(StateContext), 
    dispatch: useContext(DispatchContext)
});

const reducer = (state: State, action: Action): State => {
    if (action.type === 'OUTPUT_RECEIVED') {
        return {
            ...state, 
            output: state.output.concat([action.payload])
        }
    } 
    return state;
};

// eslint-disable-next-line react/prop-types
const GlobalStateProvider: React.ComponentType = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>
            {children}
        </StateContext.Provider>
    </DispatchContext.Provider>
};

export const App = () => <GlobalStateProvider>
    <GitLog/>
</GlobalStateProvider>;
