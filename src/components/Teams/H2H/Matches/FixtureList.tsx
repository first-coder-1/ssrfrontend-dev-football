import React, { useEffect, useState } from "react";

// import { Link as RouterLink } from 'react-router-dom';
import { styled } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import List from "@mui/material/List";
import ListItem, { ListItemProps } from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import {
  ActiveSeason,
  getFixturesByTeamAndSeason,
  maxPage,
  minPage,
  Side,
  Team,
  TeamSeasonFixture,
} from "../../../../api";
import SideSelect from "@/components/SideSelect";
import TeamLink from "@/components/TeamLink";
import DateTz from "@/components/DateTz";
import Pagination from "@/components/Pagination";
import SeasonSelect from "@/components/SeasonSelect";
import { useSeasons } from "../../../../hooks/useSeasons";
import { isPostponed, isScheduled, slugify } from "../../../../utils";
import TeamImage from "@/components/TeamImage";
import PlaceholderList from "@/components/PlaceholderList";
import { useMst } from "../../../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "@/components/shared/NavLink/NavLink";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";
import { useActiveSeason } from "@/hooks/useActiveSeason";
import { TTeamFixturesRes } from "@/pages/soccer/teams/h2h/[[...slug]]";

const useStyles = makeStyles<{ bordered?: boolean }>()((theme, { bordered }) => ({
  root: {
    height: "100%",
    position: "relative",
  },

  item: {
    [theme.breakpoints.up("md")]: {
      borderRight: bordered ? `1px solid ${theme.palette.grey[500]}` : "none",
    },
  },

  score: {
    width: theme.spacing(7.5),
    marginRight: theme.spacing(2.5),
    [theme.breakpoints.down("md")]: {
      marginRight: theme.spacing(1),
    },
  },

  primaryScore: {
    color: theme.palette.primary.main,
  },

  side: {
    width: 30,
  },

  team: {
    display: "flex",
    alignItems: "center",
  },

  prePagination: {
    height: 64,
  },

  pagination: {
    borderTop: `1px solid ${theme.palette.grey[500]}`,
    position: "absolute",
    bottom: 0,
  },

  select: {
    marginLeft: theme.spacing(1),
  },
}));

const ListHeader = styled(ListItem)<ListItemProps>(({ theme }) => ({
  height: 60,
  justifyContent: "space-between",
  backgroundColor: theme.palette.grey[theme.palette.mode === "dark" ? 400 : 100],
}));

type Props = {
  team: Team;
  bordered?: boolean;
  seasons: ActiveSeason[];
  fixtures: TTeamFixturesRes;
};

type Response = {
  loading: boolean;
  fixtures: TeamSeasonFixture[];
  min: number;
  max: number;
};

export function FixtureList({
  team,
  bordered,
  seasons: initialSeasons,
  fixtures: initialFixtures,
}: Props): React.ReactElement {
  const intl = useIntl();
  const { settings } = useMst();
  const { classes, cx } = useStyles({ bordered });
  //
  // const [seasons, activeSeason, setActiveSeason] = useSeasons(team._id, team.current_season_id);
  const [seasons, setSeasons] = useState<ActiveSeason[]>(initialSeasons);
  const [activeSeason, setActiveSeason] = useActiveSeason(seasons, team.current_season_id);
  const [side, setSide] = useState<Side | undefined>();
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<TTeamFixturesRes>(initialFixtures);
  useEffectWithoutFirstRender(() => {
    if (activeSeason?._id) {
      setResponse((response) => ({ ...response, loading: true }));
      const [promise, cancel] = getFixturesByTeamAndSeason(team._id, activeSeason._id, page, side);
      promise.then((res) =>
        setResponse({
          loading: false,
          fixtures: res.data,
          min: minPage(res),
          max: maxPage(res),
        })
      );
      return cancel;
    }
  }, [team._id, activeSeason?._id, page, side]);

  if (response.loading) {
    return <PlaceholderList size={50} />;
  }

  const seasonSelect = (
    <SeasonSelect
      activeSeason={activeSeason}
      setActiveSeason={setActiveSeason}
      seasons={seasons}
      useSeasonName
      hideTitle
    />
  );

  return (
    <List disablePadding className={classes.root}>
      <ListHeader>
        <Box className={classes.team}>
          <TeamImage
            url={team.logo_path}
            name={(!settings.originalNames && team.name_loc) || team.name}
            variant="32x"
          />
          <Typography variant="h5">{(!settings.originalNames && team.name_loc) || team.name}</Typography>
        </Box>
        <div className={classes.select}>
          <SideSelect activeSide={side} setSide={setSide} disableGutters />
        </div>
      </ListHeader>
      <ListHeader>{seasonSelect}</ListHeader>
      {response.fixtures.map((fixture) => {
        const fixtureLink = `/soccer/fixtures/${slugify(fixture.localteam_name)}/${slugify(fixture.visitorteam_name)}/${
          fixture._id
        }/summary`;
        const scheduled = isScheduled(fixture.time.status) || isPostponed(fixture.time.status);
        return (
          <ListItem key={fixture._id} className={classes.item}>
            <Chip
              color="default"
              label={
                <Link color="secondary" component={NavLink} to={fixtureLink}>
                  {scheduled
                    ? intl.get(`fixtures.statuses-3char.${fixture.time.status}`)
                    : `${fixture.localteam_score} - ${fixture.visitorteam_score}`}
                </Link>
              }
              className={cx(classes.score, { [classes.primaryScore]: scheduled })}
            />
            {team._id === fixture.localteam_id ? (
              <TeamLink
                id={fixture.visitorteam_id}
                name={fixture.visitorteam_name}
                winner={fixture.visitorteam_id === fixture.winner_team_id}
              >
                {(!settings.originalNames && fixture.visitorteam_name_loc) || fixture.visitorteam_name}
              </TeamLink>
            ) : (
              <TeamLink
                id={fixture.localteam_id}
                name={fixture.localteam_name}
                winner={fixture.localteam_id === fixture.winner_team_id}
              >
                {(!settings.originalNames && fixture.localteam_name_loc) || fixture.localteam_name}
              </TeamLink>
            )}
            <>&nbsp;</>
            <Typography
              className={classes.side}
              title={team._id === fixture.localteam_id ? intl.get("side.home") : intl.get("side.away")}
            >
              {"("}
              {team._id === fixture.localteam_id ? intl.get("side.home-short") : intl.get("side.away-short")}
              {")"}
            </Typography>
            <Typography>
              <DateTz>{fixture.time.starting_at}</DateTz>
            </Typography>
          </ListItem>
        );
      })}
      {(response.min > 1 || response.max > 1) && (
        <>
          <ListItem className={classes.prePagination} />
          <ListItem disableGutters className={classes.pagination}>
            <Pagination
              pageMin={response.min}
              pageMax={response.max}
              currentPage={page}
              onPageChange={setPage}
              reduced
            />
          </ListItem>
        </>
      )}
    </List>
  );
}

export default observer(FixtureList);
