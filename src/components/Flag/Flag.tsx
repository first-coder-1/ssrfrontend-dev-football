import React from "react";
import { makeStyles } from "tss-react/mui";
import Asset from "../Asset";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  root: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
  },
}));

type Props = {
  country: string;
  className?: string;
};

export function Flag(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const name = intl.get(`countries.${props.country}`);
  let country = props.country.toLowerCase();
  if (["aa", "ac", "nw", "oc", "sw", "wr"].includes(country)) {
    country = "gb";
  }
  return (
    <Asset
      src={`/media/svg/${country}.svg`}
      alt={name}
      title={name}
      className={cx(classes.root, props.className)}
    />
  );
}

export default Flag;
