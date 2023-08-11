import {
    toggleAutoStartUp,
    setSettings
} from "../utils/settingsFunction";

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
            setSettings('language', action.payload.value);
            return {
                ...state,
                language: action.payload.value
            }
        case 'switchAutoWindowStartUp':
            const isAutoStartUp: boolean = action.payload.value
            toggleAutoStartUp(isAutoStartUp);
            
            return {
                ...state,
                autoStartUp: isAutoStartUp
            }
        default:
            return state
    }
};