import React from "react";
import { observer } from "mobx-react-lite";
import { useMst } from "../../store";

const DFPSlotsProvider = React.lazy(() => import("react-dfp/lib/dfpslotsprovider"));

const ID = process.env.REACT_APP_DFP_NETWORK_ID || "";

interface IProps {
  children: React.ReactNode;
}
export function DfpProvider({ children }: IProps) {
  const { settings } = useMst();

  if (settings.thirdPartyCookies) {
    return <DFPSlotsProvider dfpNetworkId={ID}>{children}</DFPSlotsProvider>;
  }

  return <>{children}</>;
}

export default observer(DfpProvider);
