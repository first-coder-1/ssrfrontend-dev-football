import React, { useContext } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { CountryContext } from './CountryProvider';
import { useIntl } from '@/hooks/useIntl';

type Props = {
  value: string,
  onChange: (value: string) => void,
  national?: boolean,
  property?: '_id' | 'name' | 'country_iso2',
  variant?: 'filled' | 'outlined',
}

export function CountrySelect(props: Props): React.ReactElement {
  const intl = useIntl();
  const { value, onChange, national, property = '_id', variant = 'filled' } = props;
  let countries = useContext(CountryContext);
  if (national) {
    countries = countries.filter(country => country.national);
  }
  return (
    <Select
      value={countries.length ? value : ''}
      onChange={e => onChange(e.target.value as string)}
      disableUnderline
      displayEmpty
      title={intl.get('teams.h2h.country-placeholder')}
      variant={variant}
    >
      {!value && <MenuItem value="">{intl.get('teams.h2h.country-placeholder')}</MenuItem>}
      {countries.map((country) => (
        <MenuItem key={country._id} value={country[property]}>{country.name_loc}</MenuItem>
      ))}
    </Select>
  );
}

export default CountrySelect;
