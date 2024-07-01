import React, { useEffect } from "react";
import MHidden from "@mui/material/Hidden";
import { HiddenProps } from "@mui/material";
import { observer } from "mobx-react-lite";

import { useMst } from "@/store";

type Props = HiddenProps;

function Hidden({ children, ...rest }: Props) {
  const {
    settings: { windowSize: windowBreakpoint },
  } = useMst();
  useEffect(() => {
    console.log(`Hidden windowSize: ${windowBreakpoint}`);
  }, [windowBreakpoint]);
  return (
    <MHidden {...rest} implementation="js" initialWidth={windowBreakpoint || "lg"}>
      {children}
    </MHidden>
  );
}

export default observer(Hidden);
