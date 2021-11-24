import React, { useEffect, useCallback, useState } from 'react';
import './styles.css';
import { League, LeagueInfo } from './components/LeagueInfo';
import { Selector } from './components/Selector';
import { teams } from './teamnames';
import { useThunkReducer } from './hooks/useThunkReducer';
import { ApiDispatchTypes, dispatchFetch } from './api/api';

const intialSelectedState = { id: '', abbr: '', name: '' };

export default function App() {
  const [{ loading, response, error, cache }, dispatch] = useThunkReducer();
  const [list, setList] = useState<typeof teams>([]);
  const [selectedTeam, setSelectedTeam] = useState<typeof teams[0]>(intialSelectedState);

  useEffect(() => {
    if (selectedTeam.id === '') {
      const action: ApiDispatchTypes = 'FETCH_LEAGUES';
      const fetchAllLeagues = dispatchFetch(cache, action);
      dispatch(fetchAllLeagues);
      return;
    }
    if (selectedTeam.id) {
      (() => {
        const action: ApiDispatchTypes = 'FETCH_LEAGUE_BY_ID';
        const param = `/${selectedTeam.id}`;
        const fetchLeague = dispatchFetch(cache, action, param);
        dispatch(fetchLeague);
        return (() => {
          const action: ApiDispatchTypes = 'FETCH_LEAGUE_STANDINGS';
          const param = `/${selectedTeam.id}/standings?season=2021&sort=asc`;
          const fetchLeague = dispatchFetch(cache, action, param);
          dispatch(fetchLeague);
        })();
      })();
    }
  }, [dispatch, selectedTeam.id, cache, list]);

  useEffect(() => {
    if (!response || !response.data) return;
    if (list.length > 0) return;
    if (Array.isArray(response.data)) {
      const data: League[] = response.data;
      const getTeamNames = () =>
        data.map((team) => {
          return {
            id: team.id,
            name: team.name,
            abbr: team.abbr,
          };
        });
      setList(getTeamNames);
    }
  }, [list, response?.data]);

  function debounce(callback: any, timeOut: number) {
    let id: ReturnType<typeof setTimeout> | null = null;
    return (...arg: any[]) => {
      if (id) {
        clearTimeout(id);
      }
      id = setTimeout(() => {
        callback(...arg);
        id = null;
      }, timeOut);
    };
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchVal = event.target.value.toLowerCase().trim();
    if (searchVal === '') setSelectedTeam(intialSelectedState);

    const filterTeams = (str: string) =>
      teams.filter((team: typeof teams[0]) => {
        const teamName = team.name.toLowerCase().trim();
        const abbr = team.abbr.toLowerCase().trim();
        const testIncludes = (str: string) => {
          return function (search: string) {
            return str.includes(search);
          };
        };
        const testTeam = testIncludes(teamName);
        const testAbbr = testIncludes(abbr);
        if (testTeam(str) || testAbbr(str)) return team;
      });
    if (searchVal in cache) {
      const teamMatches = cache[searchVal];
      setList(Array.from(teamMatches));
      return setSelectedTeam(teamMatches);
    } else {
      const teamMatches = filterTeams(searchVal);

      setList(teamMatches);
      switch (teamMatches.length) {
        case 0:
          return setSelectedTeam(intialSelectedState);
        case 1:
          cache[searchVal] = teamMatches[0];
          return setSelectedTeam(teamMatches[0]);
      }
    }
  };

  const debounceHandleChange = useCallback(
    debounce((event: React.ChangeEvent<HTMLInputElement>) => handleChange(event), 300),
    []
  );

  const handleSelectTeam = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const findTeam = list.find((team) => team.name === event.target.value);
    if (findTeam === undefined) return setSelectedTeam(intialSelectedState);
    const team = findTeam;
    setSelectedTeam(team);
  };

  if (response === null || !response) {
    return null;
  }

  return (
    <div className="App">
      <form onSubmitCapture={(e) => e.preventDefault()}>
        <fieldset>
          <legend>Debouncer Example</legend>
          <label htmlFor="search"> Search Leagues</label>
          <input type="text" list="teams-list" id="search" onChange={debounceHandleChange} />
          <datalist id="teams-list">
            {list.map((team) => (
              <option key={team.id} value={team.abbr}>
                {`${team.name} - ${team.abbr}`}
              </option>
            ))}
          </datalist>
          <Selector list={list} selectedTeam={selectedTeam} handleSelectTeam={handleSelectTeam} />
        </fieldset>
      </form>
      {response.type === 'FETCH_LEAGUES' &&
        response.data.map((league) => <LeagueInfo key={league.id} league={league} />)}
      {response.type === 'FETCH_LEAGUE_BY_ID' && <LeagueInfo league={response.data} />}
      {response.type === 'FETCH_LEAGUE_STANDINGS' && <LeagueInfo league={response.data} />}

      {response.type === 'FETCH_LEAGUE_STANDINGS' && <div>{JSON.stringify({ loading, response, error }, null, 2)}</div>}
    </div>
  );
}
