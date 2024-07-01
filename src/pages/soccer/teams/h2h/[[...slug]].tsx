import React, { useEffect, useState } from "react";

// import { useNavigate, useParams } from 'react-router';
// import { Navigate } from 'react-router-dom';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Hidden from "@/components/Hidden/Hidden";
import Paper from "@mui/material/Paper";
import Form from "@/components/Teams/H2H/Form";
import {
  ActiveSeason,
  getActiveSeason,
  getFixturesByTeamAndSeason,
  getH2HFixturesByTeamsAndSeason,
  getMyTeams,
  getStandingsByStage,
  getStatsByTeamAndSeason,
  getTeam,
  getTeamHistorySeasons,
  getTopscorersBySeasonAndTeam,
  h2h,
  maxPage,
  minPage,
  MyTeam,
  Side,
  Standings,
  TeamSeasonFixture,
  Team as TeamType,
  Topscorer,
} from "@/api";
import StageTables, { StageTable } from "@/components/StageTables";
import Head2Head from "@/components/Teams/H2H/Head2Head";
import Matches from "@/components/Teams/H2H/Matches";
import Player from "@/components/Teams/H2H/Player";
import Team from "@/components/Teams/H2H/Team";
import PlaceholderList from "@/components/PlaceholderList";
import { createH2HUrlComponent } from "@/utils/h2h";
import TopTable from "@/components/Teams/H2H/TopTable";
import DefaultHead from "@/components/DefaultHead";
import { useMst } from "@/store";
import { observer } from "mobx-react-lite";
import AboutH2H from "@/components/Teams/H2H/AboutH2H";
import { useIntl } from "@/hooks/useIntl";
import { useNavigate } from "@/hooks/useNavigate";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";
import { TH2HFixtureResponse } from "@/components/Teams/H2H/Head2Head/Head2Head";
import { Stats as StatsType } from "@/api";
import { TeamsLayout } from "@/layouts/teams";

export type TTeamFixturesRes = {
  loading?: boolean;
  fixtures: TeamSeasonFixture[];
  min: number;
  max: number;
};

type Props = {
  headerRef: HTMLElement | null;
  leftTeam: TeamType;
  rightTeam: TeamType;
  H2HFixturesRes: TH2HFixtureResponse;
  leftTeamSeasons: ActiveSeason[];
  rightTeamSeasons: ActiveSeason[];
  leftTeamFixturesRes: TTeamFixturesRes;
  rightTeamFixturesRes: TTeamFixturesRes;
  leftTopscorers: Topscorer[];
  rightTopscorers: Topscorer[];
  leftTeamStandings: Standings;
  rightTeamStandings: Standings;
  h2hPairs: Array<[MyTeam, MyTeam]>;
  leftTeamStats: StatsType;
  rightTeamStats: StatsType;
};

export function H2H({
  headerRef,
  leftTeam: initialLeftTeam,
  rightTeam: initialRightTeam,
  H2HFixturesRes,
  leftTeamSeasons,
  rightTeamSeasons,
  leftTeamFixturesRes,
  rightTeamFixturesRes,
  leftTopscorers,
  rightTopscorers,
  leftTeamStandings,
  rightTeamStandings,
  h2hPairs,
  leftTeamStats,
  rightTeamStats,
}: Props): React.ReactElement | null {
  const intl = useIntl();

  const commonSeasons = {
    leftSeasons: leftTeamSeasons,
    rightSeasons: rightTeamSeasons,
  };

  const commonTopscorers = {
    leftTopscorers: leftTopscorers,
    rightTopscorers: rightTopscorers,
  };

  const commonStats = {
    leftTeamStats: leftTeamStats,
    rightTeamStats: rightTeamStats,
  };

  const {
    query: { slug },
    asPath,
  } = useRouter();
  const [leftTeamQ, rightTeamQ, leftIdQ, rightIdQ] = slug ? slug : Array(4).fill(null);
  const { settings } = useMst();
  const { leftId, rightId } = { leftId: leftIdQ, rightId: rightIdQ };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [leftTeam, setLeftTeam] = useState<TeamType | undefined | null>(initialLeftTeam);
  const [rightTeam, setRightTeam] = useState<TeamType | undefined | null>(initialRightTeam);

  useEffectWithoutFirstRender(() => {
    if (leftId && rightId) {
      setLoading(true);
      const [leftPromise, leftCancel] = getTeam(leftId);
      const [rightPromise, rightCancel] = getTeam(rightId);
      Promise.all([leftPromise, rightPromise]).then(
        ([leftRes, rightRes]) => {
          setLeftTeam(leftRes.data);
          setRightTeam(rightRes.data);
          setLoading(false);
        },
        () => {
          setLeftTeam(undefined);
          setRightTeam(undefined);
          setLoading(false);
        }
      );
      return () => {
        leftCancel();
        rightCancel();
      };
    } else {
      setLeftTeam(null);
      setRightTeam(null);
    }
  }, [leftId, rightId]);

  if (loading) {
    return (
      <Box sx={{ mt: 4 }} component={Paper}>
        <PlaceholderList size={70} />
      </Box>
    );
  }

  const headerText =
    leftTeam && rightTeam
      ? intl.get("teams.h2h.vs", {
          leftTeam: (!settings.originalNames && leftTeam.name_loc) || leftTeam.name,
          rightTeam: (!settings.originalNames && rightTeam.name_loc) || rightTeam.name,
        })
      : intl.get("teams.h2h.empty");

  let title: string;
  let description: string;

  if (leftTeam === undefined || rightTeam === undefined) {
    // return <Navigate to={`/404`}/>;
  } else if (leftTeam === null || rightTeam === null) {
    title = intl.get("title.teams.h2h-empty");
    description = intl.get("description.teams.h2h-empty");
  } else {
    let h2hTitleData = {
      teams: `${(!settings.originalNames && leftTeam.name_loc) || leftTeam.name}${
        leftTeam.country_iso2 ? ` (${intl.get(`countries.${leftTeam.country_iso2}`)})` : ``
      } ${intl.get("teams.h2h.vs-short")} ${(!settings.originalNames && rightTeam.name_loc) || rightTeam.name}${
        rightTeam.country_iso2 ? ` (${intl.get(`countries.${rightTeam.country_iso2}`)})` : ``
      }  - `,
    };
    if (leftTeam.national_team && rightTeam.national_team) {
      h2hTitleData = {
        teams: `${(!settings.originalNames && leftTeam.name_loc) || leftTeam.name}${
          leftTeam.country_iso2 ? `` : ``
        } ${intl.get("teams.h2h.vs-short")} ${(!settings.originalNames && rightTeam.name_loc) || rightTeam.name}${
          rightTeam.country_iso2 ? `` : ``
        }  - `,
      };
    }
    title = intl.get("title.teams.h2h", h2hTitleData);
    description = intl.get("description.teams.h2h", h2hTitleData);
  }

  return (
    <TeamsLayout headerText={headerText}>
      <Grid container spacing={4}>
        {/* {leftTeam && rightTeam && leftIdQ && rightIdQ ? (
          <DefaultHead
            generateUrl={() =>
              `/soccer/teams/h2h${createH2HUrlComponent(leftTeam.name, leftTeam._id, rightTeam.name, rightTeam._id)}`
            }
          >
            <title>
              {title} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
            </title>
            <meta name="description" content={description} />
            <meta
              property="twitter:title"
              content={`${title} - ${intl.get(`navbar.soccer`)} - ${process.env.REACT_APP_TITLE}`}
            />
            <meta
              property="og:title"
              content={`${title} - ${intl.get(`navbar.soccer`)} - ${process.env.REACT_APP_TITLE}`}
            />
          </DefaultHead>
        ) : (
          <DefaultHead generateUrl={(locale) => `/soccer/teams/h2h`}>
            <title>
              {title} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
            </title>
            <meta name="description" content={description} />
            <meta
              property="twitter:title"
              content={`${title} - ${intl.get(`navbar.soccer`)} - ${process.env.REACT_APP_TITLE}`}
            />
            <meta
              property="og:title"
              content={`${title} - ${intl.get(`navbar.soccer`)} - ${process.env.REACT_APP_TITLE}`}
            />
          </DefaultHead>
        )} */}
        <Grid item xs={12} lg={9}>
          <Box sx={{ mt: 4 }}>
            <Form
              onSubmit={(leftTeam: string, rightTeam: string) => {
                const [leftId, leftName] = leftTeam.split(":");
                const [rightId, rightName] = rightTeam.split(":");
                const h2HUrlComponent = createH2HUrlComponent(
                  leftName,
                  parseInt(leftId, 10),
                  rightName,
                  parseInt(rightId, 10)
                );
                navigate(`/soccer/teams/h2h${h2HUrlComponent}`);
              }}
              leftTeam={leftTeam!}
              rightTeam={rightTeam!}
            />

            {!!leftTeam && !!rightTeam && leftIdQ && rightIdQ ? (
              <>
                <Head2Head leftTeam={leftTeam} rightTeam={rightTeam} H2HFixturesRes={H2HFixturesRes} />
                <Matches
                  leftTeam={leftTeam}
                  rightTeam={rightTeam}
                  leftSeasons={leftTeamSeasons}
                  rightSeasons={rightTeamSeasons}
                  leftTeamFixturesRes={leftTeamFixturesRes}
                  rightTeamFixturesRes={rightTeamFixturesRes}
                />
                <Player
                  leftTeam={leftTeam}
                  rightTeam={rightTeam}
                  commonSeasons={commonSeasons}
                  commonTopscorers={commonTopscorers}
                />
                <Team
                  commonStats={commonStats}
                  commonSeasons={commonSeasons}
                  leftTeam={leftTeam}
                  rightTeam={rightTeam}
                />
                <AboutH2H leftTeam={leftTeam} rightTeam={rightTeam} />
              </>
            ) : (
              <>
                <AboutH2H />
              </>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Hidden lgDown implementation="css">
            <Box sx={{ mt: 4 }}>
              <TopTable pairs={h2hPairs} />
            </Box>
            {/* if teams have the same current_stage_id */}
            {leftTeam && (
              <Box sx={{ mt: 4 }}>
                <StageTables standings={leftTeamStandings} stageId={leftTeam.current_stage_id}>
                  {(standings, legend) => (
                    <>
                      <StageTable teamId={leftTeam._id} standings={standings} legend={legend} />
                      {rightTeam && rightTeam.current_stage_id === leftTeam.current_stage_id && (
                        <StageTable teamId={rightTeam._id} standings={standings} legend={legend} />
                      )}
                    </>
                  )}
                </StageTables>
              </Box>
            )}
            {/* if teams have different current_stage_id */}
            {rightTeam && rightTeam.current_stage_id !== leftTeam?.current_stage_id && (
              <Box sx={{ mt: 4 }}>
                <StageTables standings={rightTeamStandings} stageId={rightTeam.current_stage_id}>
                  {(standings, legend) => <StageTable teamId={rightTeam._id} standings={standings} legend={legend} />}
                </StageTables>
              </Box>
            )}
          </Hidden>
        </Grid>
      </Grid>
    </TeamsLayout>
  );
}

export default observer(H2H);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props: Partial<Props> = {};

  let activeCommonSeasons: {
    leftActiveSeason: ActiveSeason | null;
    rightActiveSeason: ActiveSeason | null;
  } = { leftActiveSeason: null, rightActiveSeason: null };

  let commonTeams: { leftTeam: TeamType | null; rightTeam: TeamType | null } = {
    leftTeam: null,
    rightTeam: null,
  };

  const getActiveSeason = (seasons: ActiveSeason[], defaultSeasonId?: number) => {
    return (
      seasons.find((season) => season._id === defaultSeasonId && season.has_fixtures) ||
      seasons.find((season) => season.has_fixtures) ||
      seasons[0]
    );
  };

  const {
    query: { slug },
  } = ctx;

  const [leftTeamQ, rightTeamQ, leftIdQ, rightIdQ] = slug ? slug : Array(4).fill(null);

  if (slug?.length === 4 && !!slug[3]) {
    const [getH2HFixturesByTAndS] = getH2HFixturesByTeamsAndSeason(parseInt(leftIdQ), parseInt(rightIdQ), 1);
    getH2HFixturesByTAndS.then((res) => {
      props = {
        ...props,
        H2HFixturesRes: {
          loading: false,
          fixtures: res.data,
          min: minPage(res),
          max: maxPage(res),
        },
      };
    });

    const [getLeftTeamPromise] = getTeam(leftIdQ);
    const [getLeftTeamHistorySeasonsPromise] = getTeamHistorySeasons(leftIdQ);
    const getLeftTeamFixturesAndSeasonsPromise = getLeftTeamHistorySeasonsPromise
      .then(({ data }) => {
        props = { ...props, leftTeamSeasons: data };
        return getLeftTeamPromise;
      })
      .then(({ data }) => {
        commonTeams.leftTeam = data;
        props = { ...props, leftTeam: data };
        return data;
      })
      .then((team) => {
        const seasons = props.leftTeamSeasons;
        const activeSeason = getActiveSeason(seasons!, team.current_season_id);
        activeCommonSeasons.leftActiveSeason = activeSeason;
        const [getLeftFixturesByTeamAndSeasonPromise] = getFixturesByTeamAndSeason(leftIdQ, activeSeason._id, 1); // side arg was last
        return getLeftFixturesByTeamAndSeasonPromise;
      })
      .then((res) => {
        props = {
          ...props,
          leftTeamFixturesRes: {
            loading: false,
            fixtures: res.data,
            min: minPage(res),
            max: maxPage(res),
          },
        };
      })
      .then(() => {
        const [getLeftTopscorersPromise] = getTopscorersBySeasonAndTeam(
          activeCommonSeasons.leftActiveSeason?._id!,
          leftIdQ
        );
        return getLeftTopscorersPromise;
      })
      .then(({ data }) => {
        props = { ...props, leftTopscorers: data };
        const [getStandingsByStagePromise] = getStandingsByStage(commonTeams.leftTeam?.current_stage_id!);
        return getStandingsByStagePromise;
      })
      .then(({ data }) => {
        props = { ...props, leftTeamStandings: data };
        const [getStatsByTeamAndSeasonPromise] = getStatsByTeamAndSeason(
          parseInt(leftIdQ),
          activeCommonSeasons.leftActiveSeason?._id!
        );
        return getStatsByTeamAndSeasonPromise;
      })
      .then(({ data }) => {
        props = { ...props, leftTeamStats: data };
      });

    // RIGHT SIDE ---------------------------------------

    const [getRightTeamPromise] = getTeam(rightIdQ);
    const [getRightTeamHistorySeasonsPromise] = getTeamHistorySeasons(rightIdQ);
    const getRightTeamFixturesAndSeasonsPromise = getRightTeamHistorySeasonsPromise
      .then(({ data }) => {
        props = { ...props, rightTeamSeasons: data };
        return getRightTeamPromise;
      })
      .then(({ data }) => {
        commonTeams.rightTeam = data;
        props = { ...props, rightTeam: data };
        return data;
      })
      .then((team) => {
        const seasons = props.rightTeamSeasons;
        const activeSeason = getActiveSeason(seasons!, team.current_season_id);
        activeCommonSeasons.rightActiveSeason = activeSeason;
        const [getRightFixturesByTeamAndSeasonPromise] = getFixturesByTeamAndSeason(rightIdQ, activeSeason._id, 1); // side arg was last
        return getRightFixturesByTeamAndSeasonPromise;
      })
      .then((res) => {
        props = {
          ...props,
          rightTeamFixturesRes: {
            loading: false,
            fixtures: res.data,
            min: minPage(res),
            max: maxPage(res),
          },
        };
      })
      .then(() => {
        const [getRightTopscorersPromise] = getTopscorersBySeasonAndTeam(
          activeCommonSeasons.rightActiveSeason?._id!,
          rightIdQ
        );
        return getRightTopscorersPromise;
      })
      .then(({ data }) => {
        props = { ...props, rightTopscorers: data };
        const [getStandingsByStagePromise] = getStandingsByStage(commonTeams.rightTeam?.current_stage_id!);
        return getStandingsByStagePromise;
      })
      .then(({ data }) => {
        props = { ...props, rightTeamStandings: data };
        const [getStatsByTeamAndSeasonPromise] = getStatsByTeamAndSeason(
          parseInt(rightIdQ),
          activeCommonSeasons.rightActiveSeason?._id!
        );
        return getStatsByTeamAndSeasonPromise;
      })
      .then(({ data }) => {
        props = { ...props, rightTeamStats: data };
      });

    // common part

    const [getMyTeamsPromise] = getMyTeams(h2h);
    getMyTeamsPromise.then((res) => {
      const teams = res.data.sort((a, b) => h2h.indexOf(a._id) - h2h.indexOf(b._id));
      teams.length = Math.floor(teams.length / 2) * 2;
      const pairs: Array<[MyTeam, MyTeam]> = [];
      while (teams.length > 1) {
        pairs.push([teams.shift()!, teams.shift()!]);
      }
      props = { ...props, h2hPairs: pairs };
    });

    await Promise.all([
      getLeftTeamPromise,
      getRightTeamPromise,
      getH2HFixturesByTAndS,
      getLeftTeamHistorySeasonsPromise,
      getRightTeamHistorySeasonsPromise,
      getLeftTeamFixturesAndSeasonsPromise,
      getRightTeamFixturesAndSeasonsPromise,
      getMyTeamsPromise,
    ]);
  } else {
    const [getMyTeamsPromise] = getMyTeams(h2h);
    getMyTeamsPromise.then((res) => {
      const teams = res.data.sort((a, b) => h2h.indexOf(a._id) - h2h.indexOf(b._id));
      teams.length = Math.floor(teams.length / 2) * 2;
      const pairs: Array<[MyTeam, MyTeam]> = [];
      while (teams.length > 1) {
        pairs.push([teams.shift()!, teams.shift()!]);
      }
      props = { ...props, h2hPairs: pairs };
    });

    await getMyTeamsPromise;
  }

  return {
    props,
  };
});
