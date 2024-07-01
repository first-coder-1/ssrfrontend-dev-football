import React, { useState } from "react";

import { parse } from "date-fns";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import Hidden from "@/components/Hidden/Hidden";
import Box from "@mui/material/Box";
import { Sidelined } from "@/api";
import { slugify } from "@/utils";
import Flag from "@/components/Flag";
import Injury from "@/components/Injury";
import DateTz from "@/components/DateTz";
import PlayerImage from "../PlayerImage";
import { Button } from "@mui/material";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "../shared/NavLink/NavLink";

const useStyles = makeStyles<void, "nameCell">()((theme, _params, classes) => ({
  avatar: {
    margin: theme.spacing(0, 2),
  },
  name: {
    margin: theme.spacing(0, 1.5),
    fontWeight: theme.typography.fontWeightMedium,
  },
  left: {
    flexGrow: 0,
    maxWidth: "40%",
    flexBasis: "40%",
    justifyContent: "space-around",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
      flexBasis: "100%",
      position: "relative",

      "&:after": {
        content: '""',
        background: theme.palette.grey[500],
        position: "absolute",
        bottom: 0,
        left: "3%",
        height: 1,
        width: "94%",
      },
    },
  },
  right: {
    flexGrow: 0,
    maxWidth: "60%",
    flexBasis: "60%",
    justifyContent: "space-around",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
      flexBasis: "100%",
    },
  },
  center: {
    flexGrow: 0,
    justifyContent: "space-around",
    maxWidth: "100%",
    flexBasis: "100%",
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(2.5),
    },
  },
  headRow: {
    height: 40,
    [`& .${classes.nameCell}`]: {
      justifyContent: "flex-start",
    },
  },
  bodyRow: {
    height: 60,
    [`& .${classes.nameCell}`]: {
      justifyContent: "space-between",
    },
  },
  cell: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.typography.body1.color,
    "&:last-child": {
      [theme.breakpoints.down("md")]: {
        paddingRight: theme.spacing(2),
      },
    },
  },
  nameCell: {
    paddingLeft: theme.spacing(2),
    flex: 6,
  },
  injuryCell: {
    justifyContent: "flex-start",
    [theme.breakpoints.down("md")]: {
      marginLeft: theme.spacing(2),
    },
  },
  odd: {
    backgroundColor: theme.palette.action.hover,
  },
  rowContainer: {
    borderBottom: `1px solid ${theme.palette.grey[500]}`,
  },
  number: {
    width: theme.spacing(2),
  },
}));

type Props = {
  sidelineds: Sidelined[];
  page?: number;
  hidePlayer?: boolean;
};

function parseDate(date: string) {
  return parse(date, "yyyy-MM-dd", new Date());
}

export function SidelinedTable(props: Props): React.ReactElement {
  const intl = useIntl();

  const { classes, cx } = useStyles();
  const { sidelineds, page = 1, hidePlayer } = props;
  const [sidelinedToShow] = useState(5);
  const [showAllSidelined, setShowAllSidelined] = useState(false);

  return (
    <>
      <Box sx={{ display: "flex", flexWrap: "wrap" }} className={classes.rowContainer}>
        {!hidePlayer && (
          <Hidden mdDown>
            <Box sx={{ display: "flex" }} className={cx(classes.headRow, classes.left)}>
              <Box className={cx(classes.cell, classes.nameCell)}>{intl.get("teams.player")}</Box>
            </Box>
          </Hidden>
        )}
        <Box
          sx={{ display: "flex" }}
          className={cx(classes.headRow, {
            [classes.right]: !hidePlayer,
            [classes.center]: hidePlayer,
          })}
        >
          <Box className={cx(classes.cell, classes.injuryCell)}>{intl.get("teams.reason")}</Box>
          <Box className={classes.cell}>{intl.get("teams.start-date")}</Box>
          <Box className={classes.cell}>{intl.get("teams.end-date")}</Box>
        </Box>
      </Box>
      {sidelineds.slice(0, showAllSidelined ? sidelineds.length : sidelinedToShow).map((sidelined, i) => (
        <Box
          key={`${sidelined.player_id}-${sidelined.start_date}-${sidelined.end_date}`}
          sx={{
            display: "flex",
            flexWrap: "wrap",
          }}
          className={cx(classes.rowContainer, { [classes.odd]: i % 2 === 1 })}
        >
          {!hidePlayer && (
            <Box sx={{ display: "flex" }} className={cx(classes.bodyRow, classes.left)}>
              <Box className={cx(classes.cell, classes.nameCell)}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography className={classes.number}>{(page - 1) * 10 + i + 1}</Typography>
                  <PlayerImage
                    disableMargin
                    url={sidelined.player!.image_path || undefined}
                    name={sidelined.player!.common_name}
                    className={classes.avatar}
                    variant="32x32"
                  />
                  {sidelined.player!.country_iso2 && <Flag country={sidelined.player!.country_iso2} />}
                  <Typography
                    variant="h4"
                    className={classes.name}
                    component={NavLink}
                    to={`/soccer/players/${slugify(sidelined.player!.common_name)}/${sidelined.player_id}/summary`}
                  >
                    {sidelined.player!.common_name}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          <Box
            sx={{ display: "flex" }}
            className={cx(classes.bodyRow, {
              [classes.right]: !hidePlayer,
              [classes.center]: hidePlayer,
            })}
          >
            <Box className={cx(classes.cell, classes.injuryCell)}>
              <Injury>{sidelined.description}</Injury>
            </Box>
            <Box className={classes.cell}>
              <DateTz>{parseDate(sidelined.start_date)}</DateTz>
            </Box>
            <Box className={classes.cell}>
              {sidelined.end_date ? <DateTz>{parseDate(sidelined.end_date)}</DateTz> : "-"}
            </Box>
          </Box>
        </Box>
      ))}
      {sidelineds.length > sidelinedToShow && !showAllSidelined && (
        <Box display="flex" justifyContent="center">
          <Button color="primary" onClick={() => setShowAllSidelined(true)}>
            {intl.get("team-about.show-more")}
          </Button>
        </Box>
      )}
      {showAllSidelined && (
        <Box display="flex" justifyContent="center">
          <Button color="primary" onClick={() => setShowAllSidelined(false)}>
            {intl.get("team-about.show-less")}
          </Button>
        </Box>
      )}
    </>
  );
}

export default SidelinedTable;
