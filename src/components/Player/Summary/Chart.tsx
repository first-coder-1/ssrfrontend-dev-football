import React, { useEffect, useState } from "react";
import RadarChart from "react-svg-radar-chart";
import "react-svg-radar-chart/build/css/index.css";

import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { getPlayerChart, Player, PlayerChart } from "../../../api";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  skeleton: {
    maxWidth: 400,
    maxHeight: 400,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  scale: {
    fill: theme.palette.mode === "dark" ? theme.palette.grey[400] : "none",
  },

  axis: {
    stroke: theme.palette.grey[theme.palette.mode === "dark" ? 100 : 700],
    strokeWidth: 0.2,
  },

  item: {
    backgroundColor: theme.palette.grey[300],
    lineHeight: "36px",
    minWidth: 36,
    cursor: "pointer",
    fontSize: 12,
  },
}));

const RATING_COEFFICIENT = 6;

function chartValue(value: number, rating: number) {
  return Math.min(1, (value * (RATING_COEFFICIENT + rating)) / 100);
}

const labels = ["aggression", "creativity", "attack", "defence", "sociality", "tactics", "technics"] as const;

const legend: { [key in (typeof labels)[number]]: string } = {
  aggression: "AGG",
  attack: "ATA",
  defence: "DEF",
  creativity: "CRE",
  sociality: "SOC",
  tactics: "TAC",
  technics: "TEC",
};

type Props = {
  player: Player;
};

export function Chart(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { player } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PlayerChart | undefined>();
  useEffect(() => {
    setLoading(true);
    const [promise, cancel] = getPlayerChart(player._id);
    promise
      .then(
        (res) => setData(res.data),
        () => setData(undefined)
      )
      .finally(() => setLoading(false));
    return cancel;
  }, [player]);
  const theme = useTheme();
  if (loading) {
    return (
      <div className={classes.skeleton}>
        <Skeleton variant="circular" width={300} height={300} />
      </div>
    );
  }
  if (!data || labels.filter((label) => data[label] > 1.5).length < 4) {
    return null;
  }
  const captions = labels.reduce<{ [key: string]: string }>((obj, caption) => {
    obj[caption] = intl.get(`players.${legend[caption]}`);
    return obj;
  }, {});
  const dataObj = labels.reduce<{ [key: string]: number }>((obj, caption) => {
    obj[caption] = chartValue(data[caption], data.rating);
    return obj;
  }, {});
  return (
    <>
      <RadarChart
        captions={captions}
        data={[
          {
            data: dataObj,
            meta: { color: theme.palette.primary.main },
          },
        ]}
        size={400}
        options={{
          scaleProps: () => ({
            className: cx(classes.scale, classes.axis),
            fill: "none",
          }),
          axisProps: () => ({
            className: classes.axis,
          }),
        }}
      />

      <Box sx={{ width: "100%", display: "flex", height: 36, m: 1, justifyContent: "space-around" }}>
        {labels.map((label) => (
          <Box key={label}>
            <Tooltip title={intl.get(`players.${label}`)} arrow>
              <Typography align="center" className={classes.item}>
                {intl.get(`players.${legend[label]}`)}
              </Typography>
            </Tooltip>
          </Box>
        ))}
      </Box>
    </>
  );
}
