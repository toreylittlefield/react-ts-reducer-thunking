import { Cache, ActionType, ApiDispatchTypes } from '../hooks/useThunkReducer';

const endpoint = `https://api-football-standings.azharimm.site/leagues`;

export const dispatchFetch = (cache: Cache, type: ApiDispatchTypes, params: string = '') => {
  return (dispatch: React.Dispatch<ActionType>) => {
    dispatch({ type: 'LOADING' });
    params = endpoint + params;
    if (params in cache) {
      dispatch({ type: type, payload: cache[params] });
      return;
    }
    fetch(params)
      .then((res) => res.json())
      .then((json) => {
        cache[params] = json;
        dispatch({ type: type, payload: json });
      })
      .catch((error) => dispatch({ type: 'ERROR', payload: error }));
  };
};
