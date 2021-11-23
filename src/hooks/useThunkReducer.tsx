import { useCallback, useReducer } from 'react';
import { League } from '../components/LeagueInfo';

export type Cache<T> = { [url: string]: T };

interface ApiInterface {
  status: boolean;
  data: League[] | League;
}

export type ApiDispatchTypes = 'FETCH_LEAGUES' | 'FETCH_LEAGUE_BY_ID';

export type ActionType =
  | { type: 'LOADING' }
  | { type: ApiDispatchTypes; payload: ApiInterface }
  | { type: 'ERROR'; payload: string }
  | ((dispatch: React.Dispatch<ActionType>) => void);

type StateType = {
  loading: boolean;
  response: null | ApiInterface;
  error: null | string;
  cache: Cache<string>;
};

const initialState: StateType = {
  loading: false,
  response: null,
  error: null,
  cache: {},
};

const reducer = (state: StateType, action: ActionType) => {
  if (typeof action === 'function') return state;
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'FETCH_LEAGUES':
      return { ...state, loading: false, response: action.payload };
    case 'FETCH_LEAGUE_BY_ID':
      return { ...state, loading: false, response: action.payload };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export function useThunkReducer(): [StateType, React.Dispatch<ActionType>] {
  const [state, dispatch] = useReducer(reducer, initialState);

  const enhancedDispatch = useCallback(
    (action: ActionType) => {
      console.log(action);
      if (typeof action === 'function') {
        action(dispatch);
      } else {
        dispatch(action);
      }
    },
    [dispatch]
  );
  return [state, enhancedDispatch];
}
