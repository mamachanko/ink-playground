export type State = {
    before: string[];
    selected: string;
    after: string[];
};

interface MoveSelectionUp {
    readonly type: 'MOVE_SELECTION_UP';
}

interface MoveSelectionDown {
    readonly type: 'MOVE_SELECTION_DOWN';
}

export type Action =
    | MoveSelectionUp
    | MoveSelectionDown;

export const moveSelectionUp = (): MoveSelectionUp => ({ type: 'MOVE_SELECTION_UP' });
export const moveSelectionDown = (): MoveSelectionDown => ({ type: 'MOVE_SELECTION_DOWN' });

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {

        case ('MOVE_SELECTION_UP'):
            if (state.before.length) {
                return {
                    ...state,
                    before: state.before.slice(0, state.before.length - 1),
                    selected: state.before[state.before.length - 1],
                    after: [state.selected, ...state.after],
                };
            }
            else {
                return {
                    ...state,
                    before: [state.selected, ...state.after.slice(0, state.after.length - 1)],
                    selected: state.after[state.after.length - 1],
                    after: [],
                };
            }

        case ('MOVE_SELECTION_DOWN'):
            if (state.after.length) {
                return {
                    ...state,
                    before: [...state.before, state.selected],
                    selected: state.after[0],
                    after: state.after.slice(1),
                };
            }
            else {
                return {
                    ...state,
                    before: [],
                    selected: state.before[0],
                    after: [...state.before.slice(1), state.selected],
                };
            }

        default: throw Error(`unhandled action ${action}`);
    }
};
