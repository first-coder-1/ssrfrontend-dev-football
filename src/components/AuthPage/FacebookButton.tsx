import { withStyles } from 'tss-react/mui';
import Button from '@mui/material/Button';

const StyledButton = withStyles(Button, {
  contained: {
    color: 'white',
    backgroundColor: '#3c5898',
    '&:hover': {
      backgroundColor: '#29487d',
    },
  },
});

export default StyledButton;
