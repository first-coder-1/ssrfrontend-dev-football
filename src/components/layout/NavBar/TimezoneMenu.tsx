import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@/components/icons/EditIcon';
import { TimeFormat } from '@/api';
import { dateTz } from '@/utils/dateTz'

const useStyles = makeStyles()((theme) =>
  ({
    paper: {
      width: theme.spacing(22),
      padding: theme.spacing(0.5),
    },

    list: {
      maxHeight: theme.spacing(33),
    },

    item: {
      paddingLeft: theme.spacing(0.5),
      height: theme.spacing(3),
      '&.Mui-selected': {
        backgroundColor: 'transparent',
      },
      '&.Mui-selected .MuiTypography-root': {
        color: theme.palette.secondary.main,
      },
    }
  }));

type Props = {
  onChange: (value: string) => void,
  value: string,
  timeFormat: TimeFormat,
}

const TIMEZONES = [
  '-11',
  '-10',
  '-09',
  '-08',
  '-07',
  '-06',
  '-05',
  '-04',
  '-0330',
  '-03',
  '-02',
  '-01',
  '+00',
  '+01',
  '+02',
  '+03',
  '+0330',
  '+04',
  '+05',
  '+0530',
  '+0545',
  '+06',
  '+07',
  '+08',
  '+09',
  '+0930',
  '+10',
  '+11',
  '+12',
];

export function TimezoneMenu(props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { onChange, value, timeFormat } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const date = new Date();
  const dateTimeFormat = `dd.MM ${timeFormat}, O`;
  return (
    <>
      <Button
        variant="text"
        color="secondary"
        onClick={onClick}
        endIcon={<EditIcon color="primary"/>}
      >
        {dateTz(date, value, dateTimeFormat)}
      </Button>
      <Menu
        elevation={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{ className: classes.paper }}
        MenuListProps={{ className: classes.list }}
      >
        {TIMEZONES.map(timeZone => (
          <MenuItem
            key={timeZone}
            className={classes.item}
            selected={timeZone === value}
            onClick={() => {
              onChange(timeZone);
              onClose();
            }}
          >
            <ListItemText primary={dateTz(date, timeZone, dateTimeFormat)}/>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
