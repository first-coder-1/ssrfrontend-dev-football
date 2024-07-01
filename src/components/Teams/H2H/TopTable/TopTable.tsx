import React, { useEffect, useState } from "react";

// import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import PlaceholderList from "../../../../components/PlaceholderList";
import { createH2HUrlComponent } from "../../../../utils/h2h";
import { getMyTeams, h2h, MyTeam } from "../../../../api";
import Team from "./Team";
import NavLink from "@/components/shared/NavLink/NavLink";
import { useIntl } from "@/hooks/useIntl";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";

const useStyles = makeStyles()(() => ({
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },

  team: {
    overflow: "hidden",
    flex: "0 0 45%",
  },

  vs: {
    flex: "0 0 10%",
  },
}));

type TProps = {
  pairs: Array<[MyTeam, MyTeam]>;
};

export function TopTable({ pairs: initialPairs }: TProps): React.ReactElement | null {
  const intl = useIntl();
  const { classes } = useStyles();

  const [loading, setLoading] = useState(false);
  const [pairs, setPairs] = useState<Array<[MyTeam, MyTeam]>>(initialPairs);
  useEffectWithoutFirstRender(() => {
    setLoading(true);
    const [promise, cancel] = getMyTeams(h2h);
    promise
      .then((res) => {
        const teams = res.data.sort((a, b) => h2h.indexOf(a._id) - h2h.indexOf(b._id));
        teams.length = Math.floor(teams.length / 2) * 2;
        const pairs: Array<[MyTeam, MyTeam]> = [];
        while (teams.length > 1) {
          pairs.push([teams.shift()!, teams.shift()!]);
        }
        setPairs(pairs);
      })
      .finally(() => setLoading(false));
    return cancel;
  }, []);
  if (pairs.length === 0 && !loading) {
    return null;
  }
  return (
    <>
      <Card>
        <CardHeader
          title={intl.get("teams.top10")}
          titleTypographyProps={{
            variant: "h2",
          }}
        />
        <CardContent>
          {loading && <PlaceholderList size={48} />}
          <List disablePadding>
            {pairs.map(([leftTeam, rightTeam]) => {
              const component = createH2HUrlComponent(leftTeam.name, leftTeam._id, rightTeam.name, rightTeam._id);
              return (
                <ListItem
                  key={`${leftTeam._id}-${rightTeam._id}`}
                  button
                  divider
                  component={NavLink}
                  to={`/soccer/teams/h2h${component}`}
                >
                  <div className={classes.container}>
                    <div className={classes.team}>
                      <Team team={leftTeam} />
                    </div>
                    <div className={classes.vs}>
                      <Typography align="center">{intl.get("teams.h2h.top-vs")}</Typography>
                    </div>
                    <div className={classes.team}>
                      <Team team={rightTeam} />
                    </div>
                  </div>
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>
    </>
  );
}

export default TopTable;
