import React, { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Standings, getStandingsByStage } from "../../api";
import { Legend, createLegend } from "@/utils/createLegend";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";

const useStyles = makeStyles()((theme) => ({
  legend: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },

  item: {
    "&:first-of-type > div:first-of-type": {
      borderTopLeftRadius: theme.shape.borderRadius,
    },
    "&:nth-last-of-type(2) > div:first-of-type": {
      borderBottomLeftRadius: theme.shape.borderRadius,
    },
  },

  result: {
    ...theme.textOverflow,
  },
}));

type Props = {
  stageId?: number | null;
  children: (standings: Standings, legend: Legend) => React.ReactNode;
  standings?: Standings;
};

export function StageTables(props: Props): React.ReactElement | null {
  const { classes } = useStyles();
  const { stageId, standings: initialStandings } = props;
  const theme = useTheme();
  const [standings, setStandings] = useState<Standings | undefined>(initialStandings ? initialStandings : undefined);

  useEffect(() => {
    if (stageId) {
      const [promise, cancel] = getStandingsByStage(stageId);
      promise.then(
        (res) => setStandings(res.data),
        () => setStandings(undefined)
      );
      return cancel;
    }
  }, [stageId]);
  if (!standings || standings.standings.length === 0) {
    return null;
  }
  const colors = [
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    theme.palette.primary.main,
    theme.palette.action.active,
  ];
  const legend = createLegend(standings.standings, colors, theme.palette.background.paper);
  // size should be even
  if (legend.size % 2 !== 0) {
    legend.set("", { color: "rgba(0, 0, 0, 0)", positions: [] });
  }
  return (
    <>
      {props.children(standings, legend)}

      {legend.size > 0 && (
        <Grid container component={Paper} className={classes.legend}>
          {Array.from(legend.entries()).map(([result, entry]) => (
            <Grid key={result} item container xs={6} className={classes.item}>
              <Box
                sx={{
                  bgcolor: entry.color,
                  height: 44,
                  flex: "0 0 44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: theme.palette.getContrastText(entry.color) }}>{entry.positions.join("-")}</span>
              </Box>
              <Box
                sx={{
                  height: 44,
                  p: 1,
                  flex: "1 0 0%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Typography className={classes.result} title={result}>
                  {result}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}

export default StageTables;
