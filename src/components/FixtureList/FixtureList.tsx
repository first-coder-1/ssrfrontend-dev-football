import React, { useContext, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { makeStyles } from "tss-react/mui";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import FixtureListItem from "../FixtureListItem";
import { TeamSeasonFixture } from "@/api";
import { dateTz } from "@/utils/dateTz";
import { useMst } from "@/store";
// import { Context } from '../../locales/LocaleProvider';
import PlaceholderList from "../PlaceholderList";
import { Context } from "@/locales/LocaleProvider";

const useStyles = makeStyles()((theme) => ({
  date: {
    backgroundColor: theme.palette.grey[300],
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.3, 3),
    textTransform: "capitalize",
  },
}));

type Props = {
  fixtures: TeamSeasonFixture[];
  header?: React.ReactElement;
  footer?: React.ReactElement;
  loading?: boolean;
  showPositions?: boolean;
};

const dateFormat = "EEEE dd/MM/yyyy";

export function FixtureList(props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { fixtures, header, footer, loading, showPositions } = props;

  const {
    settings: { timeZone },
  } = useMst();
  const { dateLocale } = useContext(Context);
  const map = useMemo(() => {
    return fixtures.reduce((map, fixture) => {
      const date = dateTz(fixture.time.starting_at, timeZone, dateFormat, dateLocale);
      if (map.has(date)) {
        map.get(date)!.push(fixture);
      } else {
        map.set(date, [fixture]);
      }
      return map;
    }, new Map<string, TeamSeasonFixture[]>());
  }, [fixtures, timeZone, dateLocale]);
  return (
    <>
      {loading ? (
        <PlaceholderList size={80} />
      ) : (
        <List disablePadding>
          {header}
          {Array.from(map.entries()).map(([date, fixtures]) => (
            <React.Fragment key={date}>
              <ListItem
                disableGutters
                sx={{
                  justifyContent: "center",
                  alignItems: "flex-end",
                  paddingBottom: 0,
                  height: (theme) => theme.spacing(4),
                }}
              >
                <Typography className={classes.date}>{date}</Typography>
              </ListItem>
              {fixtures.map((fixture) => (
                <FixtureListItem key={fixture._id} fixture={fixture} showPositions={showPositions} />
              ))}
            </React.Fragment>
          ))}
          {footer}
        </List>
      )}
    </>
  );
}

export default observer(FixtureList);
