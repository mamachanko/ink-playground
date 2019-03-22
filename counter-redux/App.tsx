import * as React from 'react';
import Counter from './Counter';
import { createContext, useContext, useReducer } from 'react';

const initialState = { count: 0 };
type State = typeof initialState;

interface Increment { type: 'INCREMENT' };
type Action = | Increment;

const StateContext = createContext(initialState);
const DispatchContext = createContext((() => 0) as React.Dispatch<Action>);

export const useDispatch = () => useContext(DispatchContext);
export const useGlobalState = () => useContext(StateContext);

const reducer = (state: State, action: Action): State => {
    if (action.type = 'INCREMENT') {
        return {
            ...state,
            count: state.count + 1
        }
    } else return state;
};

// eslint-disable-next-line react/prop-types
const Provider: React.ComponentType = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>
            {children}
        </StateContext.Provider>
    </DispatchContext.Provider>
};

export const App = () => <Provider>
    <Counter/>
</Provider>;
