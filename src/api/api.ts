import { Cache, ActionType } from '../hooks/useThunkReducer';

const endpoint = `https://api-football-standings.azharimm.site/leagues`;

export type ApiDispatchTypes = 'FETCH_LEAGUES' | 'FETCH_LEAGUE_BY_ID' | 'FETCH_LEAGUE_STANDINGS';

export const dispatchFetch = (cache: Cache, type: ApiDispatchTypes, params: string = '') => {
  return (dispatch: React.Dispatch<ActionType>) => {
    dispatch({ type: 'LOADING' });
    params = endpoint + params;
    if (params in cache) {
      const cached = cache[params];
      dispatch({ type: type, payload: cached });
      return;
    }
    fetch(params)
      .then((res) => res.json())
      .then((json) => {
        const res = json;
        res.type = type;
        cache[params] = res;
        dispatch({ type: type, payload: res });
      })
      .catch((error) => dispatch({ type: 'ERROR', payload: error }));
  };
};
