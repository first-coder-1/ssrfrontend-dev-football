import React from "react";
import { LeagueType } from "@/api";
import TabContainer from "@/components/TabContainer/TabContainer";
import TabbedHeader from "@/components/TabbedHeader/TabbedHeader";
import NavLink from "@/components/shared/NavLink/NavLink";
import { useActiveTab } from "@/utils/getActiveTab";
import { useIntl } from "@/hooks/useIntl";
import { competitions as competitionsUrls } from "@/sitemap";
import { transformRawLeagueType } from "@/utils/transformRawLeagueType";
import { Tab } from "@mui/material";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { useRouter } from "next/router";
import { makeStyles } from "tss-react/mui";

enum EPageName {}

type TLeaguesCompetitionsLayoutProps = {
  children: React.ReactNode;
};

const useStyles = makeStyles()((theme) => ({
  tab: {
    minWidth: theme.spacing(18),
  },
}));

export const LeaguesCompetitionsLayout: React.FC<TLeaguesCompetitionsLayoutProps> = ({ children }) => {
  const { query, asPath } = useRouter();
  const intl = useIntl();
  const { classes } = useStyles();
  const active = useActiveTab(competitionsUrls, asPath);

  const type = transformRawLeagueType(query.type as string);

  return (
    <>
      <Head>
        <title>
          {intl.get(`title.competitions.${query.type}`)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get(`description.competitions.${query.type}`)} />
      </Head>
      <TabbedHeader active={active} header={<Typography variant="h1">{intl.get(`leagues.${type}`)}</Typography>}>
        <Tab label={intl.get("leagues.domestic")} value={0} component={NavLink} to="domestic" className={classes.tab} />
        <Tab
          label={intl.get("leagues.international")}
          value={1}
          component={NavLink}
          to="international"
          className={classes.tab}
        />
        <Tab
          label={intl.get("leagues.domestic_cup")}
          value={2}
          component={NavLink}
          to="domestic-cup"
          className={classes.tab}
        />
        <Tab
          label={intl.get("leagues.cup_international")}
          value={3}
          component={NavLink}
          to="cup-international"
          className={classes.tab}
        />
        <TabContainer grow />
      </TabbedHeader>
      {children}
    </>
  );
};
