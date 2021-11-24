import React from 'react';
import { teams } from '../teamnames';

type SelectorProps = {
  list: typeof teams;
  selectedTeam: typeof teams[0];
  handleSelectTeam: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const Selector = ({ list, selectedTeam, handleSelectTeam }: SelectorProps) => {
  return (
    <>
      <label htmlFor="team-select">Select Team</label>
      <select name="teams" id="team-select" value={selectedTeam?.name} onChange={handleSelectTeam}>
        {list.length > 10 ? <option value="all">Show All Leagues</option> : null}
        {list.map((team) => (
          <option key={team.id} value={team.name}>
            {team.name}
          </option>
        ))}
      </select>
    </>
  );
};
