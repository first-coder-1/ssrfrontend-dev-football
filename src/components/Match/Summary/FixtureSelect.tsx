import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router";
// import intl from 'react-intl-universal';
import { observer } from "mobx-react-lite";
import { makeStyles } from "tss-react/mui";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import { getFixturesByStage, TeamSeasonFixture } from "../../../api";
import Select from "../../../components/Select";
import { dateTz } from "../../../utils/dateTz";
import { slugify } from "../../../utils";
import { useMst } from "../../../store";
import { useIntl } from "@/hooks/useIntl";
import { useNavigate } from "@/hooks/useNavigate";

const useStyles = makeStyles()((theme) => ({
  button: {
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : theme.palette.grey[50],
    width: "100%",
    overflow: "hidden",
    [theme.breakpoints.up("md")]: {
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
    },
  },
}));

type Props = {
  stageId: number;
  fixtureId: number;
  className?: string;
};

function option(fixture: TeamSeasonFixture, timeZone: string, originalNames: boolean) {
  return `${(!originalNames && fixture.localteam_name_loc) || fixture.localteam_name} - ${
    (!originalNames && fixture.visitorteam_name_loc) || fixture.visitorteam_name
  } (${dateTz(fixture.time.starting_at, timeZone, "dd/MM/yy")})`;
}

export function FixtureSelect(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { classes } = useStyles();
  const { stageId, fixtureId } = props;
  const navigate = useNavigate();
  // const { locale } = useParams();
  const {
    settings: { timeZone, originalNames },
  } = useMst();
  const [fixtures, setFixtures] = useState<TeamSeasonFixture[]>([]);
  useEffect(() => {
    const [promise, cancel] = getFixturesByStage(stageId);
    promise.then((res) => setFixtures(res.data));
    return cancel;
  }, [stageId]);
  const activeFixture = fixtures.find((fixture) => fixture._id === fixtureId);
  if (fixtures.length < 1) {
    return null;
  }
  return (
    <Select
      label={activeFixture ? option(activeFixture, timeZone, originalNames) : intl.get("match.select-placeholder")}
      className={classes.button}
    >
      {(onClose) =>
        fixtures.slice(0, 10).map((fixture) => (
          <MenuItem
            key={fixture._id}
            selected={fixtureId === fixture._id}
            onClick={() => {
              navigate(
                `/soccer/fixtures/${slugify(fixture.localteam_name)}/${slugify(fixture.visitorteam_name)}/${
                  fixture._id
                }/summary`
              );
              onClose();
            }}
          >
            <ListItemText primary={option(fixture, timeZone, originalNames)} />
          </MenuItem>
        ))
      }
    </Select>
  );
}

export default observer(FixtureSelect);
