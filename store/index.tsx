import React, { createContext, useReducer } from 'react';
import { Action, State } from '../types/storeTypes';

const initialState: State = {
  sideMenuToggle: true,
};

function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UPDATE_SIDEMENU_TOGGLE':
      return {
        ...state,
        sideMenuToggle: action.payload,
      };

    default:
      return state;
  }
}

export const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
