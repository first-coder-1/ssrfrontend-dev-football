import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Market, ODDS_FORMAT } from "../../../api";
import { Odd } from "@/components/FixturesPage/OddsItem/Odd";
import { BaseCard } from "./BaseCard";

const useStyles = makeStyles()((theme) => ({
  select: {
    "&.MuiSelect-outlined": {
      padding: theme.spacing(1, 2),
      width: theme.spacing(10),
    },
  },
}));

type Props = {
  market: Market;
  oddsFormat: ODDS_FORMAT;
  sort?: boolean;
};

export function SelectCard(props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { market, oddsFormat, sort } = props;
  const bookmaker = market.bookmaker[0];
  const [row, setRow] = useState(0);
  let odds = bookmaker?.odds.data;
  if (sort) {
    odds = odds.sort((a, b) => {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });
  }
  return (
    <BaseCard
      market={market}
      columns={
        <Select
          value={row}
          onChange={(e) => setRow(parseInt(e.target.value as string, 10))}
          variant="outlined"
          classes={{ select: classes.select }}
        >
          {odds?.map((odd, i) => (
            <MenuItem key={odd.label} value={i}>
              {odd.label}
            </MenuItem>
          ))}
        </Select>
      }
    >
      {(bookmaker) =>
        bookmaker.odds.data[row] && (
          <Odd
            dp3={Number(bookmaker.odds.data[row].dp3)}
            dp3Prev={Number(bookmaker.odds.data[row].dp3_prev)}
            bookmakerId={bookmaker.id}
            eventId={bookmaker.odds.data[row].bookmaker_event_id}
            format={oddsFormat}
          />
        )
      }
    </BaseCard>
  );
}
