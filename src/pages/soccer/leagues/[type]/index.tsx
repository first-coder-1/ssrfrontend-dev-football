import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Hidden from "@/components/Hidden/Hidden";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { LeagueList } from "@/components/Leagues/Competitions/LeagueList";
import { CountryLeagues, getLeagues, League, LeagueType } from "@/api";
import TopTable from "@/components/Leagues/Competitions/TopTable";
import AboutCompetitions from "@/components/Leagues/Competitions/AboutCompetitions";
import PlaceholderList from "@/components/PlaceholderList";
import { useIntl } from "@/hooks/useIntl";
import { useRouter } from "next/router";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { NextPageContext } from "next";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";
import { LeaguesCompetitionsLayout } from "@/layouts/leagues/competitions/LeaguesCompetitionsLayout";
import { transformRawLeagueType } from "@/utils/transformRawLeagueType";

type Props = {
  type: LeagueType;
  leagues: CountryLeagues[];
};

export function Leagues({ leagues }: Props): React.ReactElement {
  const intl = useIntl();
  const { query } = useRouter();
  const type = transformRawLeagueType(query.type as string);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<CountryLeagues[]>(leagues);
  useEffectWithoutFirstRender(() => {
    setLoading(true);
    const [promise, cancel] = getLeagues(type as LeagueType);
    promise
      .then(
        (res) => setCountries(res.data),
        () => setCountries([])
      )
      .finally(() => setLoading(false));
    return cancel;
  }, [type]);
  return (
    <LeaguesCompetitionsLayout>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={9}>
          <Box sx={{ mt: 4 }}>
            <Card>
              <CardHeader
                title={intl.get(`leagues.${type}`)}
                titleTypographyProps={{
                  variant: "h2",
                }}
              />
              <CardContent>
                <LeagueList list={countries} />
                {loading && <PlaceholderList size={48} />}
              </CardContent>
            </Card>
          </Box>
          <br />
          <AboutCompetitions type={type as LeagueType} />
        </Grid>
        <Grid item xs={12} md={3}>
          <Hidden lgDown>
            <Box sx={{ mt: 4 }}>
              <TopTable />
            </Box>
          </Hidden>
        </Grid>
      </Grid>
    </LeaguesCompetitionsLayout>
  );
}

export default Leagues;

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  const query = ctx.query;
  const type = transformRawLeagueType(query.type as string);

  const getLeaguesReq = getLeagues(type as LeagueType)[0];
  const { data: leagues } = await getLeaguesReq;

  return {
    props: {
      leagues,
    },
  };
});
