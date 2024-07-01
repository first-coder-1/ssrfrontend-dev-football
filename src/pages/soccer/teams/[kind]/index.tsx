import React, { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Hidden from "@/components/Hidden/Hidden";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TopTable from "@/components/Team/TopTable";
import { TeamList } from "@/components/Teams/Teams/TeamList";
import AboutTeams from "@/components/Teams/AboutTeams";
import { useIntl } from "@/hooks/useIntl";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { NextPageContext, Redirect } from "next";
import { CountryTeams, Ranking, getRankings, getTeams, national } from "@/api";
import { TeamsLayout } from "@/layouts/teams";
import { useRouter } from "next/router";

type Props = {
  national?: boolean;
  countryTeams: CountryTeams[];
  rankings: Ranking[];
};

const ENDPOINTS = ["domestic", "h2h", "national"];

export function Teams({ national: initialNational, countryTeams, rankings }: Props): React.ReactElement {
  const intl = useIntl();
  const [national, setNational] = useState(initialNational);
  const {
    query: { kind },
  } = useRouter();

  useEffect(() => {
    setNational(kind === "national");
  }, [kind]);
  return (
    <TeamsLayout>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={9}>
          <Box sx={{ mt: 4 }}>
            <Card>
              <CardHeader
                title={intl.get(`teams.${national ? "national" : "domestic"}`)}
                titleTypographyProps={{
                  variant: "h2",
                }}
              />
              <CardContent>
                <TeamList national={national} countryTeams={countryTeams} />
              </CardContent>
            </Card>
            <AboutTeams national={national} />
          </Box>
        </Grid>
        <Hidden lgDown>
          <Grid item xs={12} md={3}>
            <Box sx={{ mt: 4 }}>
              <TopTable national={national} rankings={rankings} />
            </Box>
          </Grid>
        </Hidden>
      </Grid>
    </TeamsLayout>
  );
}

export default Teams;

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  if (ENDPOINTS.includes(ctx.query.kind as string)) {
    const national = ctx.query.kind === "national";

    let props: Partial<Props> = {};

    const [getTeamsPromise] = getTeams(national, 0, 20);
    getTeamsPromise.then((res) => {
      props = { ...props, countryTeams: res.data };
    });

    const [getRankingsPromise] = getRankings(national);
    getRankingsPromise.then((res) => {
      props = { ...props, rankings: res.data };
    });

    await Promise.all([getTeamsPromise, getRankingsPromise]);

    return {
      props,
    };
  } else {
    return {
      redirect: {
        permanent: true,
        destination: `/404`,
      } as Redirect,
      props: {},
    };
  }
});
