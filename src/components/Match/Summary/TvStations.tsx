import React, { useState } from 'react';
// import intl from 'react-intl-universal';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { TvStation } from '../../../api';
import { useIntl } from '@/hooks/useIntl';

type Props = {
  tvstations: TvStation[],
}

function TvStations(props: Props) {
  const intl = useIntl();
  const { tvstations } = props;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Link variant="body2" align="center" color="action" onClick={handleClickOpen} sx={{ cursor: 'pointer' }}>
        {intl.get('teams.tvstations')}
      </Link>

      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>{intl.get('teams.tvstations')}</DialogTitle>
        <List>
          {tvstations.map((station) => (
            <ListItem key={station.tvstation}>
              <ListItemText primary={station.tvstation} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </>
  );
}

export default TvStations;