import React from "react";
// import { useNavigate, useParams } from 'react-router';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { useMst } from "@/store";
import UserIcon from "@/components/icons/UserIcon";
import { useIntl } from "@/hooks/useIntl";
import { useNavigate } from "@/hooks/useNavigate";
import { observer } from "mobx-react-lite";

export function UserMenu(): React.ReactElement {
  const { auth } = useMst();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const intl = useIntl();

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    if (auth.user) {
      setAnchorEl(event.currentTarget);
    } else {
      navigate(`/auth/login`);
    }
  };

  const onClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton onClick={onClick}>
        <UserIcon />
      </IconButton>
      <Menu
        elevation={0}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <MenuItem>
          <ListItemText primary={auth.user?.username} />
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            auth.logout();
            onClose();
          }}
        >
          <ListItemText primary={intl.get(`auth.logout`)} />
        </MenuItem>
      </Menu>
    </>
  );
}

export default observer(UserMenu);
