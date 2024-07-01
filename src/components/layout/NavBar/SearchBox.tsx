import React, { useEffect, useRef, useState } from "react";
import { Canceler } from "axios";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import useMediaQuery from "@mui/material/useMediaQuery";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import { LeaguesList, PlayersList, TeamsList } from "@/components/Search";
import { searchQuick, SearchResult } from "@/api";
import SearchIcon from "@/components/icons/SearchIcon";
import { useIntl } from "@/hooks/useIntl";
import { useRouter } from "next/router";
import { useNavigate } from "@/hooks/useNavigate";

const PER_PAGE = 5;

const useStyles = makeStyles()((theme) => ({
  root: {
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.grey[300]
        : theme.palette.grey[50],
    marginRight: -2,
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none !important",
    },
    [theme.breakpoints.up("md")]: {
      boxShadow: `inset 3px 0px 0px ${theme.palette.primary.main}`,
      height: theme.spacing(5),
      width: 423,
    },
    [theme.breakpoints.down("lg")]: {
      height: theme.spacing(6),
      width: "100%",
    },
  },

  icon: {
    cursor: "pointer",
  },

  popper: {
    width: 790,
    zIndex: theme.zIndex.appBar + 1,
    overflow: "auto",
    maxHeight: 580,
    ...theme.scrollbar,
  },
}));

type Props = {
  onClose: () => void;
};

export default function SearchBox(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { onClose } = props;
  const navigate = useNavigate();
  const { locale } = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  const [results, setResults] = useState<SearchResult | undefined>();
  useEffect(() => {
    let canceler: Canceler = () => undefined;
    let timeout: ReturnType<typeof setTimeout>;
    if (isDesktop && value.length > 2) {
      setTimeout(() => {
        const [promise, cancel] = searchQuick(value);
        promise.then(
          (res) => setResults(res.data),
          () => setResults(undefined)
        );
        canceler = cancel;
      }, 300);
      return () => {
        clearTimeout(timeout);
        canceler();
      };
    }
  }, [isDesktop, value]);
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/soccer/search/all/${encodeURIComponent(value)}`);
          onClose();
        }}
      >
        <OutlinedInput
          ref={ref}
          className={classes.root}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (e.target.value.length >= 3) {
              setOpen(true);
            }
          }}
          onFocus={() => {
            if (value.length >= 3) {
              setOpen(true);
            }
          }}
          placeholder={intl.get("navbar.search")}
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon
                color="action"
                onClick={() => {
                  if (value.length >= 3) {
                    navigate(
                      `/soccer/search/all/${encodeURIComponent(
                        value
                      )}`
                    );
                  }
                  onClose();
                }}
                className={classes.icon}
              />
            </InputAdornment>
          }
          inputProps={{
            minLength: 3,
          }}
        />

        <Popper
          open={
            open &&
            !!results &&
            (results.leagues.length > 0 ||
              results.players.length > 0 ||
              results.teams.length > 0)
          }
          anchorEl={ref.current}
          placement="bottom-end"
          className={classes.popper}
        >
          <Paper>
            {results?.leagues && results?.leagues.length > 0 && (
              <LeaguesList
                leagues={results.leagues}
                onClick={onClose}
                perPage={PER_PAGE}
                isLastPage
              />
            )}
            {results?.teams && results?.teams.length > 0 && (
              <TeamsList
                teams={results.teams}
                onClick={onClose}
                perPage={PER_PAGE}
                isLastPage
              />
            )}
            {results?.players && results?.players.length > 0 && (
              <PlayersList
                players={results.players}
                onClick={onClose}
                perPage={PER_PAGE}
                isLastPage
              />
            )}
          </Paper>
        </Popper>
      </form>
    </ClickAwayListener>
  );
}
