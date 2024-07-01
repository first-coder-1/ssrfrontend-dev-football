import TabContainer from "@/components/TabContainer/TabContainer";
import TabbedHeader from "@/components/TabbedHeader/TabbedHeader";
import NavLink from "@/components/shared/NavLink/NavLink";
import { useActiveTab } from "@/utils/getActiveTab";
import { useIntl } from "@/hooks/useIntl";
import { teams } from "@/sitemap";
import { Tab, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

type TTeamLayoutProps = {
  children: React.ReactNode;
  headerText?: string;
};

export const TeamsLayout: React.FC<TTeamLayoutProps> = ({ children, headerText }) => {
  const intl = useIntl();
  const { asPath, query } = useRouter();
  const active = useActiveTab(teams, asPath);
  const national = query?.kind === "national";

  return (
    <>
      <TabbedHeader
        header={
          <Typography variant="h1">
            {headerText || intl.get(`teams.h2h.${national ? "national" : "domestic"}-teams`)}
          </Typography>
        }
        active={active}
      >
        <Tab label={intl.get("teams.domestic")} value={0} component={NavLink} to="/soccer/teams/domestic" />
        <Tab label={intl.get("teams.national")} value={1} component={NavLink} to="/soccer/teams/national" />
        <Tab label={intl.get("teams.h2h.label")} value={2} component={NavLink} to="/soccer/teams/h2h" />
        <TabContainer grow />
      </TabbedHeader>
      {children}
    </>
  );
};
