import React from 'react';
import List from '@mui/material/List';
import { CountryLeagues } from '@/api';
import LeagueItem from './LeagueItem';

type Props = {
  list: CountryLeagues[],
}

export function LeagueList(props: Props): React.ReactElement {
  const { list } = props;
  return (
    <List disablePadding>
      {list.map(country => (
        <LeagueItem key={country._id || 'other'} country={country}/>
      ))}
    </List>
  );
}
