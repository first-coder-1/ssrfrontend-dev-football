import { withStyles } from 'tss-react/mui';
import Button from '@mui/material/Button';

const StyledButton = withStyles(Button, {
  contained: {
    color: 'white',
    backgroundColor: '#f65314',
    '&:hover': {
      backgroundColor: '#ea4335',
    },
  },
});

export default StyledButton;
