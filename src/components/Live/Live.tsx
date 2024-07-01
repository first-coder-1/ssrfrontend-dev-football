import React from "react";

import Chip from "@mui/material/Chip";
import { isLive } from "@/utils";
import { FixtureStatus } from "@/api";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  status: FixtureStatus;
  className?: string;
};

export function Live(props: Props): React.ReactElement {
  const intl = useIntl();
  return (
    <Chip
      label={intl.get("fixtures.live-status")}
      color={isLive(props.status) ? "primary" : "secondary"}
      size="small"
      className={props.className}
    />
  );
}

export default Live;
