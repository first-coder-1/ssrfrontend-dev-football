import React from "react";
import { observer } from "mobx-react-lite";
import { styled } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import LightIcon from "@/components/icons/LightIcon";
import DarkIcon from "@/components/icons/DarkIcon";
import { useMst } from "@/store";

const useStyles = makeStyles()((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 16,
    padding: "2px 2px",
  },
}));

const StyledIconButton = styled(
  IconButton,
  {},
)<IconButtonProps>(({ theme }) => ({
  width: theme.spacing(2.5),
  height: theme.spacing(2.5),
  padding: 0,
  color: theme.palette.action.active,
  "&.MuiIconButton-colorPrimary": {
    color: "white",
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  "&.MuiIconButton-colorSecondary": {
    backgroundColor: "transparent",
  },
}));

export const ThemeSwitch = observer(function (): React.ReactElement {
  const { classes } = useStyles();
  const {
    settings: { dark, changeDark },
  } = useMst();

  return (
    <div className={classes.root}>
      <StyledIconButton
        disableRipple
        size="small"
        onClick={() => changeDark(true)}
        color={dark ? "primary" : "secondary"}
      >
        <DarkIcon viewBox="0 0 11 10" fontSize="small" />
      </StyledIconButton>
      <StyledIconButton
        disableRipple
        size="small"
        onClick={() => changeDark(false)}
        color={!dark ? "primary" : "secondary"}
      >
        <LightIcon viewBox="0 0 11 12" fontSize="small" />
      </StyledIconButton>
    </div>
  );
});
