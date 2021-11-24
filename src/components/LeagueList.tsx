import React from 'react';
import { ApiType } from '../hooks/useThunkReducer';
import { teams } from '../teamnames';
import { LeagueInfo } from './LeagueInfo';

type Props = {
  response: ApiType;
  list: typeof teams;
  toggleSort: boolean;
};

const LeagueList = ({ response, list, toggleSort }: Props) => {
  if (response.type !== 'FETCH_LEAGUES') return null;
  let copyList = [...response.data];
  if (toggleSort === true) {
    copyList.reverse();
  }
  return (
    <>
      {copyList.map((league) => {
        if (list.find((team) => team.id.match(league.id))) {
          return <LeagueInfo key={league.id} league={league} />;
        }
      })}
    </>
  );
};

export default LeagueList;
