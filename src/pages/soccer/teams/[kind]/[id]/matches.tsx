import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { useSeasons } from "@/hooks/useSeasons";
import {
  ActiveSeason,
  getFixturesByTeamAndSeason,
  getTeam,
  getTeamActiveSeasons,
  getTeamHistorySeasons,
  maxPage,
  minPage,
  Side,
  Team,
} from "@/api";
import TeamFixtureList, { Response } from "@/components/TeamFixtureList";
import PlaceholderList from "@/components/PlaceholderList";
import { useRouter } from "next/router";
import Head from "next/head";
import { useIntl } from "@/hooks/useIntl";
import { useMst } from "@/store";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { NextPageContext } from "next";
import { team } from "@/sitemap";
import { TTeamFixturesRes } from "../../h2h/[[...slug]]";
import { useActiveSeasons } from "@/hooks/useActiveSeasons";
import { useActiveSeason } from "@/hooks/useActiveSeason";
import { getActiveSeason } from "@/utils/getActiveSeason";
import { TeamLayout } from "@/layouts/team";
import { observer } from "mobx-react-lite";

type Props = {
  team: Team;
  seasonId: number;
  title: string;
  fixturesRes: TTeamFixturesRes;
  seasons: ActiveSeason[];
  activeSeason: ActiveSeason;
};

export function FixturesCard({
  team,
  fixturesRes,
  seasons,
  activeSeason: initialActiveSeasons,
}: Props): React.ReactElement | null {
  const intl = useIntl();

  const {
    query: { id },
  } = useRouter();

  const { settings } = useMst();

  const teamId = parseInt(id as string);
  const title = "Matches"; // @TODO: make dynamic title
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [teamId]);

  const [side, setSide] = useState<Side | undefined>();
  const [response, setResponse] = useState<Response>(fixturesRes);

  const [activeSeason, setActiveSeason] = useActiveSeason(seasons, team.current_season_id, initialActiveSeasons);

  useEffect(() => {
    if (activeSeason?._id) {
      setResponse((response) => ({ ...response, loading: true }));
      const [promise, cancel] = getFixturesByTeamAndSeason(teamId, activeSeason._id, page, side);
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
  }, [teamId, activeSeason?._id, page, side]);

  let teamTitleData = {
    name: (!settings.originalNames && team.name_loc) || team.name,
    country: team.country_iso2 ? `(${intl.get(`countries.${team.country_iso2}`)}) ` : "",
  };
  if (team.national_team) {
    teamTitleData = {
      name: (!settings.originalNames && team.name_loc) || team.name,
      country: team.country_iso2 ? `` : "",
    };
  }

  if (!activeSeason?._id || (response.fixtures.length === 0 && !response.loading)) {
    return null;
  }

  return (
    <TeamLayout team={team}>
      <Head>
        <title>
          {intl.get("title.team.matches", teamTitleData)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.team.matches", teamTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.team.matches", teamTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.team.matches", teamTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      <Card>
        <CardHeader
          title={title}
          titleTypographyProps={{
            variant: "h2",
          }}
        />
        <CardContent>
          {response.loading ? (
            <PlaceholderList size={70} />
          ) : (
            <TeamFixtureList
              response={response}
              seasons={seasons}
              activeSeason={activeSeason}
              setActiveSeason={setActiveSeason}
              page={page}
              setPage={setPage}
              side={side}
              setSide={setSide}
            />
          )}
        </CardContent>
      </Card>
    </TeamLayout>
  );
}

export default observer(FixturesCard);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  const teamId = parseInt(ctx.query.id as string);

  let props: Partial<Props> = {};

  const [getTeamPromise] = getTeam(teamId);
  const [getTeamActiveSeasonsPromise] = getTeamHistorySeasons(teamId);
  const getTeamAndFixturesPromise = getTeamPromise
    .then(({ data }) => {
      props = { ...props, team: data };
      return data;
    })
    .then((team) => {
      const [getFixturesByTeamAndSeasonPromise] = getFixturesByTeamAndSeason(teamId, team.current_season_id, 1);
      return getFixturesByTeamAndSeasonPromise;
    })
    .then((res) => {
      props = { ...props, fixturesRes: { min: minPage(res), max: maxPage(res), fixtures: res.data, loading: false } };
    })
    .then(() => {
      getTeamActiveSeasonsPromise.then((res) => {
        const activeSeason = getActiveSeason(res.data, props.team?.current_season_id);
        props = { ...props, seasons: res.data, activeSeason: activeSeason };
      });
    });
  await Promise.all([getTeamAndFixturesPromise, getTeamActiveSeasonsPromise]);

  return {
    props,
  };
});
