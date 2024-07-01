import React from "react";
import { player as playerUrls } from "@/sitemap";
import { ActiveSeason, Player, PlayerRatingHistory, PlayerStats } from "@/api";
import DefaultHead from "@/components/DefaultHead/DefaultHead";
import { Stats } from "@/components/Player/Stats";
import TabContainer from "@/components/TabContainer/TabContainer";
import TabbedHeader from "@/components/TabbedHeader/TabbedHeader";
import NavLink from "@/components/shared/NavLink/NavLink";
import { useActiveTab } from "@/utils/getActiveTab";
import { useIntl } from "@/hooks/useIntl";
import { slugify } from "@/utils";
import { Box, Grid, Tab, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { TFixturesByPlAndSRes } from "@/components/Player/Matches/MatchesTab";
import { useMst } from "@/store";

type TPlayerLayoutProps = {
  children: React.ReactNode;
  player: Player;
  playerStats: PlayerStats;
  playerHistory: PlayerRatingHistory[];
  playerSeasons: ActiveSeason[];
};

export const PlayerPageLayout: React.FC<TPlayerLayoutProps> = ({
  children,
  player,
  playerStats,
  playerHistory,
  playerSeasons,
}) => {
  const intl = useIntl();
  const { query } = useRouter();
  const active = useActiveTab(playerUrls);
  const { intermediate } = useMst();

  const playerFixtures = intermediate.FixturesByPlAndSRes.fixtures;

  return (
    <>
      {/* <DefaultHead params={{ name: slugify(player.common_name) }} /> */}

      <TabbedHeader header={<Typography variant="h1">{player.display_name}</Typography>} active={active}>
        <Tab
          label={intl.get(`players.summary`)}
          value={0}
          component={NavLink}
          to={`/soccer/players/${query.name}/${query.id}/summary`}
        />
        {playerSeasons.length > 0 && playerFixtures?.length && (
          <Tab
            label={intl.get(`players.matches`)}
            value={1}
            component={NavLink}
            to={`/soccer/players/${query.name}/${query.id}/matches`}
          />
        )}
        <TabContainer grow />
      </TabbedHeader>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={9}>
            {children}
          </Grid>
          <Grid item xs={12} lg={3}>
            {playerStats && playerHistory && (
              <Stats player={player} playerStats={playerStats} playerHistory={playerHistory} />
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
