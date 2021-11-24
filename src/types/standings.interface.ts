export type LeagueStandings = {
  status: boolean;
  data: LeagueStandingsData;
};

export type LeagueStandingsData = {
  name: string;
  abbreviation: string;
  seasonDisplay: string;
  season: number;
  standings: Standing[];
};

export interface Standing {
  team: Team;
  note?: Note;
  stats: Stat[];
}

export interface Note {
  color: string;
  description: string;
  rank: number;
}

export interface Stat {
  name: Name;
  displayName: Description;
  shortDisplayName: ShortDisplayName;
  description: Description;
  abbreviation: Abbreviation;
  type: Type;
  value?: number;
  displayValue: string;
  id?: string;
  summary?: string;
}

export enum Abbreviation {
  A = 'A',
  D = 'D',
  F = 'F',
  Gd = 'GD',
  Gp = 'GP',
  L = 'L',
  P = 'P',
  PD = 'PD',
  Ppg = 'PPG',
  R = 'R',
  RC = 'RC',
  Total = 'Total',
  W = 'W',
}

export enum Description {
  Draws = 'Draws',
  GamesPlayed = 'Games Played',
  GoalDifference = 'Goal Difference',
  GoalsAgainst = 'Goals Against',
  GoalsFor = 'Goals For',
  Losses = 'Losses',
  Overall = 'Overall',
  OverallRecord = 'Overall Record',
  PointDeductions = 'Point Deductions',
  Points = 'Points',
  PointsPerGame = 'Points Per Game',
  Rank = 'Rank',
  RankChange = 'Rank Change',
  WINS = 'Wins',
}

export enum Name {
  AllSplits = 'All Splits',
  Deductions = 'deductions',
  GamesPlayed = 'gamesPlayed',
  Losses = 'losses',
  PointDifferential = 'pointDifferential',
  Points = 'points',
  PointsAgainst = 'pointsAgainst',
  PointsFor = 'pointsFor',
  Ppg = 'ppg',
  Rank = 'rank',
  RankChange = 'rankChange',
  Ties = 'ties',
  WINS = 'wins',
}

export enum ShortDisplayName {
  A = 'A',
  D = 'D',
  Deductions = 'Deductions',
  F = 'F',
  Gd = 'GD',
  Gp = 'GP',
  L = 'L',
  Over = 'OVER',
  P = 'P',
  Ppg = 'PPG',
  Rank = 'Rank',
  RankChange = 'Rank Change',
  W = 'W',
}

export enum Type {
  Deductions = 'deductions',
  Gamesplayed = 'gamesplayed',
  Losses = 'losses',
  Pointdifferential = 'pointdifferential',
  Points = 'points',
  Pointsagainst = 'pointsagainst',
  Pointsfor = 'pointsfor',
  Ppg = 'ppg',
  Rank = 'rank',
  Rankchange = 'rankchange',
  Ties = 'ties',
  Total = 'total',
  WINS = 'wins',
}

export interface Team {
  id: string;
  uid: string;
  location: string;
  name: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  isActive: boolean;
  logos: Logo[];
}

export interface Logo {
  href: string;
  width: number;
  height: number;
  alt: string;
  rel: Rel[];
  lastUpdated: Date;
}

export enum Rel {
  Default = 'default',
  Full = 'full',
}
