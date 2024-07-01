import React from "react";

import { makeStyles } from "tss-react/mui";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { Side } from "../../api";
import SortIcon from "../icons/SortIcon";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  button: {
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : theme.palette.grey[50],
    minWidth: "auto",
    height: "100%",
  },

  gutters: {
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(0, 1.5),
    },
  },

  item: {
    "&.Mui-selected": {
      backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[500] : theme.palette.grey[100],
    },
  },

  show: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

type Props = {
  activeSide?: Side;
  setSide: (side?: Side) => void;
  disableGutters?: boolean;
};

export function SideSelect(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { activeSide, setSide, disableGutters } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        color="secondary"
        onClick={onClick}
        endIcon={<SortIcon color="action" />}
        className={cx(classes.button, { [classes.gutters]: !disableGutters })}
      >
        <span className={classes.show}>{intl.get("teams.show")}:</span>
        &nbsp;
        {intl.get(`side.${activeSide || "all"}`)}
      </Button>
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
        {[undefined, Side.HOME, Side.AWAY].map((side) => (
          <MenuItem
            key={String(side)}
            className={classes.item}
            selected={side === activeSide}
            onClick={() => {
              setSide(side);
              onClose();
            }}
          >
            <ListItemText primary={intl.get(`side.${side || "all"}`)} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default SideSelect;
