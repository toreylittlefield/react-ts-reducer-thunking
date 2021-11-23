import React, { useReducer, useEffect, useCallback, useState, useRef } from 'react';
import './styles.css';
import { teams } from './teamnames';

const endpoint = `https://api-football-standings.azharimm.site/leagues
`;

type Cache<T> = { [url: string]: T };

interface Logos {
  light: string;
  dark: string;
}

interface League {
  id: string;
  name: string;
  slug: string;
  abbr: string;
  logos: Logos;
}

interface ApiInterface {
  status: boolean;
  data: League[] | League;
}

type ActionType =
  | { type: 'LOADING' }
  | { type: 'FETCH_LEAGUES'; payload: ApiInterface }
  | { type: 'FETCH_LEAGUE_BY_ID'; payload: ApiInterface }
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

function useFetch(): [StateType, React.Dispatch<ActionType>] {
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
  return [state, enhancedDispatch];
}

const fetchLeagues = (params: string, cache: Cache<any>) => {
  return (dispatch: React.Dispatch<ActionType>) => {
    dispatch({ type: 'LOADING' });
    if (params in cache) {
      dispatch({ type: 'FETCH_LEAGUES', payload: cache[params] });
      return;
    }
    fetch(endpoint)
      .then((res) => res.json())
      .then((json) => {
        cache[params] = json;
        dispatch({ type: 'FETCH_LEAGUES', payload: json });
      })
      .catch((error) => dispatch({ type: 'ERROR', payload: error }));
  };
};

const fetchByLeagueId = (params: string, cache: Cache<any>) => {
  return (dispatch: React.Dispatch<ActionType>) => {
    dispatch({ type: 'LOADING' });
    if (params in cache) {
      dispatch({ type: 'FETCH_LEAGUE_BY_ID', payload: cache[params] });
      return;
    }
    fetch(endpoint + params)
      .then((res) => res.json())
      .then((json) => {
        cache[params] = json;
        dispatch({ type: 'FETCH_LEAGUE_BY_ID', payload: json });
      })
      .catch((error) => dispatch({ type: 'ERROR', payload: error }));
  };
};

const intialSelectedState = { id: '', abbr: '', name: '' };

export default function App() {
  const [{ loading, response, error, cache }, dispatch] = useFetch();
  const [list, setList] = useState<typeof teams>([]);
  const [selectedTeam, setSelectedTeam] = useState<typeof teams[0]>(intialSelectedState);

  useEffect(() => {
    console.log(selectedTeam.id);
    if (selectedTeam.id.length !== 0) return;
    const fetchAllLeagues = fetchLeagues('', cache);
    dispatch(fetchAllLeagues);
  }, [dispatch, selectedTeam.id, cache]);

  useEffect(() => {
    if (selectedTeam.id === '') return;
    const fetchLeague = fetchByLeagueId('/' + selectedTeam.id, cache);
    dispatch(fetchLeague);
  }, [selectedTeam.id, cache, dispatch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchVal = event.target.value;
    if (searchVal === '') setSelectedTeam(intialSelectedState);
    const filterTeams = (str: string) =>
      teams.filter((team: typeof teams[0]) => {
        const teamName = team.name.toLowerCase();
        const abbr = team.abbr.toLowerCase();
        const testIncludes = (str: string) => {
          return function (search: string) {
            return str.includes(search);
          };
        };
        const testTeam = testIncludes(teamName);
        const testAbbr = testIncludes(abbr);
        if (testTeam(str) || testAbbr(str)) return team;
      });
    const teamMatches = filterTeams(searchVal);
    setList(teamMatches);
  };

  const handleSelectTeam = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    const findTeam = list.find((team) => team.name === event.target.value);
    if (findTeam === undefined) return;
    const team: typeof teams[0] = findTeam;
    setSelectedTeam(team);
  };

  type LeagueInfoProps = {
    league: League;
  };

  const LeagueInfo = ({ league }: LeagueInfoProps) => {
    const { id, name, slug, abbr, logos } = league;
    const { light, dark } = logos;
    return (
      <section key={id}>
        <div>
          <h2>{name}</h2>
          <h3>{abbr}</h3>
          <picture>
            <source srcSet={light} media="(min-width: 800px)" />
            <img src={dark} alt={name} />
          </picture>
        </div>
      </section>
    );
  };

  const selector =
    list.length > 0 ? (
      <>
        <label htmlFor="team-select">Select Team</label>
        <select name="teams" id="team-select" value={selectedTeam?.name} onChange={handleSelectTeam}>
          {list.map((team) => (
            <option key={team.id} value={team.name}>
              {team.name}
            </option>
          ))}
        </select>
      </>
    ) : null;

  if (response === null || !response) {
    return null;
  }

  return (
    <div className="App">
      <form>
        <fieldset>
          <legend>Debouncer Example</legend>
          <label htmlFor="search"> Search Leagues</label>
          <input type="text" id="search" onChange={handleChange} />
          {selector}
        </fieldset>
      </form>
      {Array.isArray(response.data) ? (
        response.data.map((league) => <LeagueInfo key={league.id} league={league} />)
      ) : (
        <LeagueInfo league={response.data} />
      )}
      <div>{JSON.stringify({ loading, response, error }, null, 2)}</div>
    </div>
  );
}
