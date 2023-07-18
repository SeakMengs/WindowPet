import { useContext, useState, createContext } from "react";

export const AppContext = createContext();

/*
 * This is the state provider for the AppContext
 * Any component that needs to use the AppContext should be wrapped in this component
 * Only the components that are wrapped in this component can access the AppContext
 * Do not use state that is change frequently in this context
 * Because this context is used in every component, changing the state will cause all components to re-render
 */

const AppContextProvider = ({ children }) => {

    const [test, setTest] = useState(null);

    const value = {
        test,
        setTest,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider

/*
 * This code is used to create a context object that is used to store the global state of the app.
 * This is done to avoid importing useContext and AppContext in every component that needs to use  * the global state.
 */
export const AppState = () => {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('usedAppContext must be used within a AppContextProvider')
    }
    return context
}