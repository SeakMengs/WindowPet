interface State {
    language: string;
    autoStartUp: boolean;
}

interface Action {
    type: string;
    payload: any;
}

export const settingReducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'changeAppLanguage':
            return {
                ...state,
                language: action.payload.value
            }
        case 'switchAutoWindowStartUp':
            return {
                ...state,
                autoStartUp: action.payload.value
            }
        default:
            return state
    }
};