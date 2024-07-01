import React from "react";
// import intl from 'react-intl-universal';
import { observer } from "mobx-react-lite";
import { parse } from "date-fns";
import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import EditIcon from "../icons/EditIcon";
import { Round } from "../../api";
import Select from "../Select";
import { useMst } from "../../store";
import { dateTz } from "../../utils/dateTz";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  box: {
    display: "flex",
    alignItems: "center",
  },

  icon: {
    marginLeft: theme.spacing(1),
  },
}));

function formatDate(date: string, today: Date, timeZone: string): string {
  return dateTz(parse(date, "yyyy-MM-dd", today), timeZone, "dd/MM/yy");
}

function dateString(start: string | null, end: string | null): string {
  if (start === null && end === null) {
    return "";
  } else if (start === end) {
    return `(${start})`;
  } else {
    return `(${start} - ${end})`;
  }
}

type Props = {
  rounds: Round[];
  activeRound: Round;
  setActiveRound: (round: Round) => void;
};

export function RoundSelect(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { rounds, activeRound, setActiveRound } = props;
  const {
    settings: { timeZone },
  } = useMst();
  const today = new Date();
  let date = "";
  if (activeRound) {
    const activeStart = activeRound.start ? formatDate(activeRound.start, today, timeZone) : null;
    const activeEnd = activeRound.end ? formatDate(activeRound.end, today, timeZone) : null;
    date = dateString(activeStart, activeEnd);
  }

  return (
    <Select
      label={
        <Box className={classes.box}>
          {intl.get("round-select", { name: activeRound.name, date })}
          <EditIcon color="primary" fontSize="small" className={classes.icon} />
        </Box>
      }
    >
      {(onClose) =>
        rounds.map((round, i) => {
          const start = round.start ? formatDate(round.start, today, timeZone) : null;
          const end = round.end ? formatDate(round.end, today, timeZone) : null;
          return (
            <MenuItem
              key={round._id}
              selected={activeRound?._id === round._id}
              onClick={() => {
                setActiveRound(round);
                onClose();
              }}
            >
              <ListItemText
                primary={intl.get("round-select", {
                  name: i + 1,
                  date: dateString(start, end),
                })}
              />
            </MenuItem>
          );
        })
      }
    </Select>
  );
}

export default observer(RoundSelect);
