import { slugify } from './slugify';

export function createH2HUrlComponent(team1Name: string, team1Id: number, team2Name: string, team2Id: number) {
  let leftTeamName: string;
  let leftTeamId: number;
  let rightTeamName: string;
  let rightTeamId: number;
  if (team1Id < team2Id) {
    leftTeamName = team1Name;
    leftTeamId = team1Id;
    rightTeamName = team2Name;
    rightTeamId = team2Id;
  } else {
    leftTeamName = team2Name;
    leftTeamId = team2Id;
    rightTeamName = team1Name;
    rightTeamId = team1Id;
  }


  return `/${slugify(leftTeamName)}/${slugify(rightTeamName)}/${leftTeamId}/${rightTeamId}`;
}
