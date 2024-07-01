import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

type Props = {
  value: string,
  onChange: (value: string) => void,
}

const values = ['=', '>', '<'];

export function ExpressionSelect(props: Props): React.ReactElement {
  const { value, onChange } = props;
  return (
    <Select
      value={value}
      onChange={e => onChange(e.target.value as string)}
      disableUnderline
    >
      <MenuItem value="">&nbsp;</MenuItem>
      {values.map((val) => (
        <MenuItem key={val} value={val}>{val}</MenuItem>
      ))}
    </Select>
  );
}

export default ExpressionSelect;
