import { useCallback, useReducer } from 'react';
import { League } from '../components/LeagueInfo';
import { ApiDispatchTypes } from '../api/api';
import { LeagueStandingsData } from '../types/standings.interface';

export type Cache = { [key: string]: any };

type FetchLeagueByIdType = {
  type: 'FETCH_LEAGUE_BY_ID';
  data: League;
};

type FetchLeaguesType = {
  type: 'FETCH_LEAGUES';
  data: League[];
};

type FetchLeagueStandingsType = {
  type: 'FETCH_LEAGUE_STANDINGS';
  data: LeagueStandingsData & League;
};

type ApiUnion = FetchLeagueByIdType | FetchLeaguesType | FetchLeagueStandingsType;

type ApiType = {
  status: boolean;
} & ApiUnion;

export type ActionType =
  | { type: 'LOADING' }
  | { type: ApiDispatchTypes; payload: ApiType }
  | { type: 'ERROR'; payload: string }
  | ((dispatch: React.Dispatch<ActionType>) => void);

type StateType = {
  loading: boolean;
  response: null | ApiType;
  error: null | string;
  cache: Cache;
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
    case 'FETCH_LEAGUE_STANDINGS':
      const dataMerge: any = {
        ...action.payload,
        data: { ...state.response?.data, ...action.payload.data },
      };
      return {
        ...state,
        loading: false,
        response: dataMerge,
      };
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
      if (typeof action === 'function') {
        action(dispatch);
      } else {
        dispatch(action);
      }
    },
    [dispatch]
  );
  console.log(state.response);
  return [state, enhancedDispatch];
}
