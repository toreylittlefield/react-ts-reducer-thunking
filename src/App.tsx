import React, { useReducer, useEffect, useCallback, useState, useRef } from 'react';
import './styles.css';
import { League, LeagueInfo } from './components/LeagueInfo';
import { Selector } from './components/Selector';
import { teams } from './teamnames';
import { useThunkReducer } from './hooks/useThunkReducer';
import { dispatchFetch } from './api/api';

const intialSelectedState = { id: '', abbr: '', name: '' };

export default function App() {
  const [{ loading, response, error, cache }, dispatch] = useThunkReducer();
  const [list, setList] = useState<typeof teams>([]);
  const [selectedTeam, setSelectedTeam] = useState<typeof teams[0]>(intialSelectedState);

  useEffect(() => {
    if (selectedTeam.id === '') {
      const action = 'FETCH_LEAGUES';
      const fetchAllLeagues = dispatchFetch(cache, action);
      dispatch(fetchAllLeagues);
    }
    if (selectedTeam.id.length !== 0) {
      const action = 'FETCH_LEAGUE_BY_ID';
      const param = `/${selectedTeam.id}`;
      const fetchLeague = dispatchFetch(cache, action, param);
      dispatch(fetchLeague);
    }
  }, [dispatch, selectedTeam.id, cache]);

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
      <form>
        <fieldset>
          <legend>Debouncer Example</legend>
          <label htmlFor="search"> Search Leagues</label>
          <input type="text" id="search" onChange={handleChange} />
          <Selector list={list} selectedTeam={selectedTeam} handleSelectTeam={handleSelectTeam} />
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
