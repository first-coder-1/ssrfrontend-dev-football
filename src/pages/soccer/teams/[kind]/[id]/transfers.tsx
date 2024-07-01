import React, { FC } from "react";
import { getTeam, getTeamTransfersByYear, getTeamTransferYears, Team, Transfers as TTransfers } from "@/api";
import Transfers from "@/components/Team/Transfers/Transfers";
import { useIntl } from "@/hooks/useIntl";
import { useMst } from "@/store";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { NextPageContext } from "next";
import Head from "next/head";
import { te } from "date-fns/locale";
import { TeamLayout } from "@/layouts/team";
import { observer } from "mobx-react-lite";

type TTransfersPage = {
  team: Team;
  transfers: TTransfers;
  transferYears: number[];
};

const TransfersPage: FC<TTransfersPage> = ({ team, transfers, transferYears }) => {
  const intl = useIntl();

  const { settings } = useMst();

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
  return (
    <TeamLayout team={team}>
      <Head>
        <title>
          {intl.get("title.team.transfers", teamTitleData)} - {intl.get(`navbar.soccer`)} -{" "}
          {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.team.transfers", teamTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.team.transfers", teamTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.team.transfers", teamTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      {team && <Transfers transferYears={transferYears} transfers={transfers} team={team} />}
    </TeamLayout>
  );
};

export default observer(TransfersPage);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  const teamId = parseInt(ctx.query.id as string);
  let props: Partial<TTransfersPage> = {};

  const [getTeamPromise] = getTeam(teamId);
  getTeamPromise.then(({ data }) => {
    props = { ...props, team: data };
  });

  const [getTeamTransferYearsPromise] = getTeamTransferYears(teamId);

  const getTransfersAndYearsPromise = getTeamTransferYearsPromise
    .then(({ data }) => {
      props = { ...props, transferYears: data };
      const [getTeamTransfersByYearPromise] = getTeamTransfersByYear(teamId, data[0]);
      return getTeamTransfersByYearPromise;
    })
    .then(({ data }) => {
      props = { ...props, transfers: data };
    });

  await Promise.all([getTeamPromise, getTransfersAndYearsPromise, getTeamTransferYearsPromise]);

  return {
    props,
  };
});
