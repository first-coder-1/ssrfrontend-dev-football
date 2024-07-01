import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { AuthStore } from '@/store/AuthStore';
import { useIntl } from '@/hooks/useIntl';

type Props = {
  auth: AuthStore,
  onDelete: () => void,
}

export function DeleteAccount(props: Props): React.ReactElement {
  const intl = useIntl();
  const { auth, onDelete } = props;
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    auth.delete();
    onDelete();
  }
  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        {intl.get('auth.delete-account')}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{intl.get('auth.delete-account')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {intl.get('auth.delete-account-text')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleDelete} color="primary">
            {intl.get('delete')}
          </Button>
          <Button variant="contained" onClick={handleClose} color="secondary" autoFocus>
            {intl.get('cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
