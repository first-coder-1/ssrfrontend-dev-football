import React, { useEffect, useState } from "react";

import { makeStyles } from "tss-react/mui";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { getTeamLastMatch, Fixture, Team } from "@/api";
import PlaceholderList from "@/components/PlaceholderList";
import { observer } from "mobx-react-lite";
import AboutSquad from "../AboutSquad/AboutSquad";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles<{ image?: string }>()((theme, { image }) => {
  const textShadow = image ? `${theme.palette.grey[900]} 1px 0 2px` : "none";
  return {
    root: theme.scrollbar as {},
    status: {
      color: image
        ? theme.palette.primary.contrastText
        : theme.palette.mode === "dark"
        ? theme.palette.grey[200]
        : theme.palette.grey[600],
      textShadow,
    },
    time: {
      color: theme.palette.success.main,
      position: "absolute",
      paddingLeft: theme.spacing(1),
    },
  };
});

type Props = {
  team: Team;
  lastMatch: Fixture;
};

export function AboutResult(props: Props): React.ReactElement {
  const intl = useIntl();
  const { team, lastMatch } = props;

  const [showMore, setShowMore] = useState(false);

  // @TODO: Fix bug when trying to change showMore state

  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  const [loading, setLoading] = useState(false);
  const [fixture, setFixture] = useState<Fixture | undefined>(lastMatch);
  const { classes } = useStyles({});
  useEffect(() => {
    setLoading(true);
    const [promise, cancel] = getTeamLastMatch(team._id);
    promise.then((res) => setFixture(res.data)).finally(() => setLoading(false));
    return cancel;
  }, [team]);

  if (loading) {
    return (
      <Box sx={{ width: 730 }}>
        <PlaceholderList size={50} />;
      </Box>
    );
  }
  return (
    <Box sx={{ width: "100%", height: 240, overflow: "auto" }} className={classes.root}>
      {!!fixture && (
        <>
          <Box sx={{ p: 2 }}>
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: "1 0 auto",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  {intl.get("team-about.main", { teamName: team.name_loc || team.name })}
                  <br />
                  <br />
                  {intl.get("team-about.upcoming", { teamName: team.name_loc || team.name })}
                  <br />
                  <br />
                  {intl.get("team-about.upcoming-select", { teamName: team.name_loc || team.name })}
                  <br />
                  {intl.get("team-about.upcoming-once", { teamName: team.name_loc || team.name })}
                  <br />
                  <br />
                  {intl.get("team-about.upcoming-we", { teamName: team.name_loc || team.name })}
                </Box>

                {showMore && (
                  <Box display="flex" justifyContent="flex-end">
                    <br />
                    {team.facts && (
                      <>
                        {team.facts.split("\n").map((str) => (
                          <>
                            {str}
                            <br />
                          </>
                        ))}{" "}
                        <br />
                        <br />
                      </>
                    )}

                    <>
                      {intl.get("team-about.recent", { teamName: team.name_loc || team.name })}
                      <br />
                      <br />
                    </>
                    {fixture.league && (
                      <>
                        {fixture.localteam._id !== team._id && fixture.winner_team_id ? (
                          <>
                            {intl.get("team-about.recent-last", {
                              teamName: team.name_loc || team.name,
                              otherTeamName: fixture.localteam.name_loc || fixture.localteam.name,
                              leagueName: fixture.league.name_loc || fixture.league.name,
                              gameLocalResult: fixture.scores.localteam_score,
                              gameVisitorResult: fixture.scores.visitorteam_score,
                            })}
                          </>
                        ) : (
                          <>
                            {intl.get("team-about.recent-last", {
                              teamName: team.name_loc || team.name,
                              otherTeamName: fixture.localteam.name_loc || fixture.localteam.name,
                              leagueName: fixture.league.name_loc || fixture.league.name,
                              gameLocalResult: fixture.scores.localteam_score,
                              gameVisitorResult: fixture.scores.visitorteam_score,
                            })}
                          </>
                        )}
                        {team._id === fixture.winner_team_id ? (
                          <> ({intl.get("team-about.recent-won", { teamName: team.name_loc || team.name })})</>
                        ) : (
                          <></>
                        )}
                        .<br />
                        <br />
                      </>
                    )}
                    {intl.get("team-about.recent-fixtures", { teamName: team.name_loc || team.name })}
                    <br />
                    {intl.get("team-about.recent-also", { teamName: team.name_loc || team.name })}
                    <br />
                    <br />
                    {intl.get("team-about.performance", { teamName: team.name_loc || team.name })}
                    <br />
                    <br />
                    {intl.get("team-about.squad", { teamName: team.name_loc || team.name })}
                    <br />
                    {team.has_squads && <AboutSquad team={team} />}
                    <br />
                    <br />
                    {intl.get("team-about.squad-current", { teamName: team.name_loc || team.name })}
                    <br />
                    <br />

                    {intl.get("team-about.stats", { teamName: team.name_loc || team.name })}
                    <br />
                    <br />

                    {intl.get("team-about.topscorers", { teamName: team.name_loc || team.name })}
                    <br />
                    <br />

                    {intl.get("team-about.clicking", { teamName: team.name_loc || team.name })}
                    <br />
                    <br />

                    {intl.get("team-about.visit", { teamName: team.name_loc || team.name })}
                  </Box>
                )}
                <Box display="flex" justifyContent="flex-end">
                  <Button color="primary" onClick={handleShowMore}>
                    {showMore ? intl.get("team-about.show-less") : intl.get("team-about.show-more")}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default observer(AboutResult);
