import { useReducer, useEffect, useCallback, useState } from 'react';
import './styles.css';
import { teams } from './teamnames';

const endpoint = `https://api-football-standings.azharimm.site/leagues
`;

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
  data: null | ApiInterface;
  error: null | string;
};

const initialState: StateType = {
  loading: false,
  data: null,
  error: null,
};

const reducer = (state: StateType, action: ActionType) => {
  // if() return state
  if (typeof action === 'function') return state;
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'FETCH_LEAGUES':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_LEAGUE_BY_ID':
      return { ...state, loading: false, data: action.payload };
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

const fetchLeagues = (dispatch: React.Dispatch<ActionType>) => {
  dispatch({ type: 'LOADING' });
  const res = fetch(endpoint)
    .then((res) => res.json())
    .then((json) => dispatch({ type: 'FETCH_LEAGUES', payload: json }))
    .catch((error) => dispatch({ type: 'ERROR', payload: error }));
  return res;
};

const fetchByParams = (params: string) => {
  return (dispatch: React.Dispatch<ActionType>) => {
    dispatch({ type: 'LOADING' });
    fetch(endpoint + params)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        dispatch({ type: 'FETCH_LEAGUE_BY_ID', payload: json });
      })
      .catch((error) => dispatch({ type: 'ERROR', payload: error }));
  };
};

export default function App() {
  const [{ loading, data, error }, dispatch] = useFetch();
  const [list, setList] = useState<typeof teams>([]);
  const [selectedTeam, setSelectedTeam] = useState<typeof teams[0]>({ id: '', abbr: '', name: '' });

  useEffect(() => {
    if (selectedTeam.id.length !== 0) return;
    dispatch(fetchLeagues);
  }, [dispatch, selectedTeam.id]);

  useEffect(() => {
    if (selectedTeam.id === '') return;
    const fetchLeague = fetchByParams('/' + selectedTeam.id);
    dispatch(fetchLeague);
  }, [selectedTeam.id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchVal = event.target.value;
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
            <source srcSet={dark} media="(min-width: 800px)" />
            <img src={light} alt={name} />
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

  if (data === null) return null;

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
      {Array.isArray(data?.data) ? (
        data.data.map((league) => {
          <LeagueInfo key={league.id} league={league} />;
        })
      ) : (
        <LeagueInfo league={data.data} />
      )}
      <div>{JSON.stringify({ loading, data, error }, null, 2)}</div>
    </div>
  );
}
