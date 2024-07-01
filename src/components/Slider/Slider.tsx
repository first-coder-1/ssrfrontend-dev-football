import * as React from 'react';
import { styled } from '@mui/material/styles';
import SliderComponent, { SliderThumb, SliderProps } from '@mui/material/Slider';

const StyledSlider = styled(SliderComponent)<SliderProps>(({ theme }) => ({
  width: 'calc(100% - 14px)',
  margin: '0 auto',
  height: 8,
  padding: '13px 0',
  '& .MuiSlider-thumb': {
    height: 24,
    width: 14,
    backgroundColor: '#fff',
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: 3,
    boxShadow: '0.5px 1px 0.8px rgba(0, 0, 0, 0.05), 1px 2px 6px rgba(0, 0, 0, 0.06)',
    '& .bar': {
      height: 8,
      width: 2,
      backgroundColor: theme.palette.grey[400],
      marginLeft: 1,
      marginRight: 1,
    },
  },
  '& .MuiSlider-track': {
    height: 8,
  },
  '& .MuiSlider-rail': {
    color: theme.palette.grey[300],
    opacity: 1,
    height: 8,
    borderRadius: 11,
  },
}));

interface ThumbComponentProps extends React.HTMLAttributes<unknown> {}

function ThumbComponent(props: ThumbComponentProps) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="bar" />
      <span className="bar" />
    </SliderThumb>
  );
}

type Props = {
  minValue: number,
  maxValue: number,
  min: number,
  max: number,
  onChange: (values: number[]) => void,
}

export function Slider(props: Props): React.ReactElement {
  const { minValue, maxValue, min, max, onChange } = props;
  const [value, setValue] = React.useState([minValue, maxValue]);
  return (
    <StyledSlider
      color="primary"
      components={{ Thumb: ThumbComponent }}
      min={min}
      max={max}
      value={value}
      onChange={(_, values) => setValue(values as number[])}
      onChangeCommitted={(_, values) => onChange(values as number[])}
    />
  );
}

export default Slider;

