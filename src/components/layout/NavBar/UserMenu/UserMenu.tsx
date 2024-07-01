import React from "react";
// import intl from "react-intl-universal";
// import { useNavigate, useParams } from "react-router";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { useMst } from "@/store";
import { useRouter } from "next/router";
import { useNavigate } from "@/hooks/useNavigate";
// import UserIcon from "../icons/UserIcon";

export function UserMenu(): React.ReactElement {
  const { auth } = useMst();
  //
  const navigate = useNavigate();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    if (auth.user) {
      setAnchorEl(event.currentTarget);
    } else {
      router.push(`/about`);
    }
  };

  const onClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton onClick={onClick}>
        {/* <UserIcon /> */}
        <div
          style={{
            color: "red",
            width: "30px",
            height: "30px",
            border: "thin solid grey",
            borderRadius: "50%",
          }}
        >
          <div style={{ margin: "auto" }}>Q</div>
        </div>
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
          logout
          {/* TODO: <ListItemText primary={intl.get(`auth.logout`)} /> */}
        </MenuItem>
      </Menu>
    </>
  );
}
