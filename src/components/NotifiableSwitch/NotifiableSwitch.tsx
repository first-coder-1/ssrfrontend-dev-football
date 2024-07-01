import React, { useState } from "react";

import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import NotificationIcon from "../icons/NotificationIcon";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  checked?: boolean;
  disabled?: boolean;
  isLoggedIn?: boolean;
  onChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export function NotifiableSwitch(props: Props): React.ReactElement {
  const intl = useIntl();
  const theme = useTheme();
  const { checked, disabled, onChange, isLoggedIn } = props;
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <IconButton disabled={disabled} onClick={(e) => (isLoggedIn ? onChange(e) : handleClickOpen())}>
        {checked ? (
          <NotificationIcon htmlColor={theme.palette.primary.main} />
        ) : (
          <NotificationIcon color={disabled ? "disabled" : "inherit"} />
        )}
      </IconButton>
      <Dialog onClose={handleClose} open={open}>
        <DialogContent dividers>
          <Typography gutterBottom>{intl.get("settings.notifications-login-alert")}</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NotifiableSwitch;
